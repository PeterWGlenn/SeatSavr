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
    public class TestDeploymentFetchController : ControllerBase
    {
        [HttpGet]
        public int Get()
        {
            return 42;
        }
    }
}
