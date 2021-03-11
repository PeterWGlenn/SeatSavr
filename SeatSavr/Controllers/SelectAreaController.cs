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
            Area[] areas = Database.GetAreaDataAsync("SampleLayout").Result;
            return areas;
        }
    }
}
