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
        public TestObject Get()
        {
            // Call the database
            Admin[] adminds = Database.GetAdminDataAsync().Result;

            return new TestObject();
        }
    }

    public class TestObject
    {
        public int Number { get; set; }
        public string String { get; set; }

        public TestObject()
        {
            Number = 42;
            String = "Testing";
        }
    }
}
