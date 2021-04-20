using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Reservation
    {
        public string Id { get; set; }

        public DateTime Date { get; set; }

        public float Duration { get; set; }

        public Customer Customer { get; set; }

        public string ReservedAreaName { get; set; }

        public string ReservedAreaAddress { get; set; }

        // TODO - PG -> make this method safer
        public static string GenerateId()
        {
            Random random = new Random();
            return LongRandom(0, long.MaxValue, random).ToString();
        }

        private static long LongRandom(long min, long max, Random rand)
        {
            byte[] buf = new byte[8];
            rand.NextBytes(buf);
            long longRand = BitConverter.ToInt64(buf, 0);

            return (Math.Abs(longRand % (max - min)) + min);
        }

        public bool IsDefined()
        {
            return Customer != null;
        }
    }
}
