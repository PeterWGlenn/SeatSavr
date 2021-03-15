using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Area
    {
        public enum Type
        {
            Chair,
            Table,
            Booth,
            Stool
        }

        public Type AreaType { get; set; }

        public PointF AreaLocation { get; set; }

        public int NumberOfSeats { get; set; }

        public string Name { get; set; }

        public List<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
