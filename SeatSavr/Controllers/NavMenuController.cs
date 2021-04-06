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
    public class NavMenuController : ControllerBase
    {
        [HttpPost("[action]")]
        public bool CreateAdmin([FromBody] Admin admin)
        {
            return Database.AddAdmin(admin);
        }
    }
}
