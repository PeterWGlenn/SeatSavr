using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr
{
    public class Customer
    {
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool isDefined()
        {
            return Email != null;
        }
    }
}
