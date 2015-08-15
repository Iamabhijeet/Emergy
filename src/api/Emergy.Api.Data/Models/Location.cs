using System;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;

namespace Emergy.Data.Models
{
    public class Location : ModelBase
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Name { get; set; }
        public LocationType Type { get; set; }
        public DateTime DateCaptured { get; set; }
    }
}
