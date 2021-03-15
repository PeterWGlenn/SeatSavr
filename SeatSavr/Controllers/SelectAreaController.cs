using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SelectAreaController
    {
        [HttpGet]
        public IEnumerable<Area> Get()
        {
            return Database.GetAreaDataAsync("SampleLayout").Result;
        }

        [HttpPost]
        public bool Create([FromBody] ReservationData d)
        {
            if (!d.isValid())
                return false;

            Customer c = new Customer()
            {
                Email = d.Email,
                FirstName = d.FirstName,
                LastName = d.LastName
            };

            if (!Database.AddCustomer(c))
                return false;

            Reservation r = new Reservation()
            {
                Id = Reservation.GenerateId(),
                Date = DateTime.Parse(d.Date),
                Duration = d.Duration,
                Customer = c
            };

            Area a = new Area()
            {
                AreaLocation = new PointF(d.AreaLocX, d.AreaLocY)
            };

            return Database.AddReservation(r, a);
        }

        public class ReservationData
        {
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public float Duration { get; set; }
            public string Date { get; set; }
            public float AreaLocX { get; set; }
            public float AreaLocY { get; set; }

            public bool isValid()
            {
                return Email != null && Email != string.Empty;
            }
        }
    }
}
