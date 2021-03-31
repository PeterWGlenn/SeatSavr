using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminSelectLayoutController : Controller
    {
        [HttpGet("[action]")]
        public Layout[] GetLayouts(string email)
        {
            return Database.GetAdminLayoutsAsync(email).Result;
        }

        [HttpPost("[action]")]
        public bool CreateLayout([FromBody] Layout layout)
        {
            Admin admin = new Admin() { Email = "sampleAdmin123@gmail.com" };
            return Database.AddLayout(layout, admin);
        }
    }
}