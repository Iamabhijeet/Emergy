using System;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.Location
{
    public class CreateLocationViewModel
    {
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public LocationType Type { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
    public class EditLocationViewModel
    {
        [Required]
        public double Latitude { get; set; }
        [Required]
        public double Longitude { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public LocationType Type { get; set; }
    }
}
