using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Unit : ModelBase
    {
        public Unit()
        {
            Reports = new HashSet<Report>();
            Clients = new HashSet<ApplicationUser>();
            CustomProperties = new HashSet<CustomProperty>();
            Categories = new HashSet<Category>();
            Locations = new HashSet<Location>();
        }

        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }

        [ForeignKey("AdministratorId")]
        [JsonIgnore]
        public ApplicationUser Administrator { get; set; }
        public string AdministratorId { get; set; }

        [JsonIgnore]
        public ICollection<ApplicationUser> Clients { get; set; }
        [JsonIgnore]
        public ICollection<Report> Reports { get; set; }
        [JsonIgnore]
        public ICollection<CustomProperty> CustomProperties { get; set; }
        [JsonIgnore]
        public ICollection<Category> Categories { get; set; }
        [JsonIgnore]
        public ICollection<Location> Locations { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
    }
}
