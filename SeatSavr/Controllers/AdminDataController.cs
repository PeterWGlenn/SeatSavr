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
        private int _idInc = 23;

        [HttpGet]
        public IEnumerable<Admin> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 50).Select(index => new Admin
            {
                // TODO PG -> Made this use Database.cs instead of using randomly generated data
                Id = _idInc++
            })
            .ToArray();
        }
    }
}
