﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace SeatSavr.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EditorUploadController
    {
        [HttpGet]
        public Layout Get()
        {
            return Database.GetLayoutAsync("SampleLayout").Result;
        }

        [HttpPost]
        public bool Create([FromBody] LayoutData d)
        {
            if (!d.IsValid())
                return false;

            Layout l = new Layout()
            {
                Name = d.Name,
                Address = d.Address
            };
            l.LayoutImage = d.CleanedLayoutImageString();

            foreach(Area a in d.GetNewAreas())
            {
                l.Areas.Add(a);
            }

            return Database.UpdateLayout(l);
        }

        public class LayoutData
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string LayoutImage { get; set; }
            public List<PointF> NewAreaLocations { get; set; } = new List<PointF>();

            public bool IsValid()
            {
                return LayoutImage != null;
            }

            public string CleanedLayoutImageString()
            {
                return LayoutImage.Split(',')[1];
            }

            public List<Area> GetNewAreas()
            {
                List<Area> areas = new List<Area>();

                // Note: The areas generated here are new and thus have no reservations associated with them
                foreach (PointF loc in NewAreaLocations)
                {
                    areas.Add(new Area()
                    {
                        AreaType = Area.Type.Chair,
                        AreaLocation = new PointF(loc.X, loc.Y),
                        NumberOfSeats = 1,
                        Name = "Generated Seat"
                    });
                }

                return areas;
            }
        }
    }
}
