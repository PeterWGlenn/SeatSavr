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
            if (!d.IsValid())
                return false;

            Customer c = Database.GetCustomer(d.Email).Result;

            // Add new customer if one doesn't exist with this email
            if (c == null)
            {
                c = new Customer()
                {
                    Email = d.Email,
                    FirstName = d.FirstName,
                    LastName = d.LastName
                };

                if (!Database.AddCustomer(c))
                    return false;
            }
            // If customer already exists, update the name values
            else
            {
                Database.UpdateCustomer(d.ToCustomer());
                c = Database.GetCustomer(d.Email).Result;
            }

            return Database.AddReservation(d.ToReservation(c), d.ToArea());
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
                    Date = DateTime.Parse(Date),
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
