using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Models.Base;

namespace Emergy.Api.Data.Models
{
    public class Location : ModelBase
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Name { get; set; }
        public DateTime DateCaptured { get; set; }
    }
}
