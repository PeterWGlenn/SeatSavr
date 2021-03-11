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
        public IEnumerable<AreaViewModel> Get()
        {
            List<AreaViewModel> areaViewModels = new List<AreaViewModel>();

            foreach (Area a in Database.GetAreaDataAsync("SampleLayout").Result)
            {
                AreaViewModel aViewModel = new AreaViewModel(a);

                foreach (Reservation r in a.Reservations)
                {
                    DateTime startDate = r.Date;
                    DateTime endDate = startDate.AddHours(r.Duration);
                    DateTime selectedDate = DateTime.Now; // TODO PG -> change this from now to actually selected datetime

                    aViewModel.IsReserved = selectedDate >= startDate && selectedDate <= endDate;
                }

                areaViewModels.Add(aViewModel);
            }

            return areaViewModels;
        }
    }

    public class AreaViewModel : Area
    {
        public AreaViewModel(Area a)
        {
            AreaType = a.AreaType;
            AreaLocation = a.AreaLocation;
            NumberOfSeats = a.NumberOfSeats;
            Name = a.Name;
            Reservations = a.Reservations;
        }

        public bool IsReserved { get; set; }
    }
}
