using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Reservation
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public float Duration { get; set; }

        public Customer Customer { get; set; }
    }
}
