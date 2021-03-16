using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Layout
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public string LayoutImage { get; set; }

        public List<Area> Areas { get; set; } = new List<Area>();

        public bool IsDefined()
        {
            return Address != null;
        }

        public bool HasImage()
        {
            return LayoutImage != null;
        }
    }
}
