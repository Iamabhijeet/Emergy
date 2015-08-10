using System;
using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class Location : ModelBase
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Name { get; set; }
        public DateTime DateCaptured { get; set; }
    }
}
