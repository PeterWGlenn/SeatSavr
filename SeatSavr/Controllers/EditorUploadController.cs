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
            l.DecodeLayoutImage(d.CleanedLayoutImageString());

            return Database.UpdateLayout(l);
        }

        public class LayoutData
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string LayoutImage { get; set; }

            public bool IsValid()
            {
                return LayoutImage != null;
            }

            public string CleanedLayoutImageString()
            {
                string[] parts = LayoutImage.Split(',');
                return parts[1];
            }
        }
    }
}
