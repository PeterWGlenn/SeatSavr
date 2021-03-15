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
        public bool Create([FromBody] Customer customer)
        {
            if (customer == null || customer.Email == null || customer.Email == string.Empty)
                return false;

            return Database.AddCustomer(customer.Email, customer.FirstName, customer.LastName);
        }
    }
}
