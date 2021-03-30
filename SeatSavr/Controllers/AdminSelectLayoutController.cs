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
        public Layout[] GetLayouts(string address)
        {
            return Database.GetAdminLayoutsAsync(address).Result;
        }
    }
}