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
    public class CancelReservationController : ControllerBase
    {
        [HttpGet("[action]")]
        public Reservation GetReservation(string id)
        {
            Reservation result = Database.GetReservation(id).Result;

            return result ?? new Reservation(); 
        }

        [HttpPost("[action]")]
        public bool Cancel(string id)
        {
            return Database.CancelReservation(id); 
        }
    }
}
