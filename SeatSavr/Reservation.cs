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

        // TODO - PG -> make this method safer
        public static int GenerateId()
        {
            Random random = new Random();
            return random.Next(9999999);
        }
    }
}
