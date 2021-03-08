using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminDataController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Admin> Get()
        {
            return Database.GetAdminDataAsync().Result;
        }
    }
}
