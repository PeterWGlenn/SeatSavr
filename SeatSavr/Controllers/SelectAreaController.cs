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
        [HttpGet("[action]")]
        public Layout GetLayout(string address)
        {
            return Database.GetLayoutAsync(address).Result;
        }

        [HttpPost("[action]")]
        public bool SaveReservation([FromBody] ReservationData d)
        {
            if (!d.IsValid())
                return false;

            Customer c = d.ToCustomer();

            return Database.AddReservation(d.ToReservation(c), d.ToArea(), c);
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

            public Customer ToCustomer()
            {
                return new Customer()
                {
                    Email = Email,
                    FirstName = FirstName,
                    LastName = LastName
                };
            }
            public Reservation ToReservation(Customer c)
            {
                return new Reservation()
                {
                    Id = Reservation.GenerateId(),
                    Date = DateTime.Parse(Date).ToUniversalTime(),
                    Duration = Duration,
                    Customer = c
                };
            }

            public Area ToArea()
            {
                return new Area() { AreaLocation = new PointF(AreaLocX, AreaLocY) };
            }

            public bool IsValid()
            {
                return Email != null && Email != string.Empty;
            }
        }
    }
}
