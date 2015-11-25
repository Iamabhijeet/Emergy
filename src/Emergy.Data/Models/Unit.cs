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
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }

        [JsonIgnore]
        [ForeignKey("AdministratorId")]
        public virtual ApplicationUser Administrator { get; set; }
        public virtual string AdministratorId { get; set; }

        [JsonIgnore]
        public virtual ICollection<ApplicationUser> Clients { get; set; }
        [JsonIgnore]
        public virtual ICollection<Report> Reports { get; set; }
        [JsonIgnore]
        public virtual ICollection<CustomProperty> CustomProperties { get; set; }
        [JsonIgnore]
        public virtual ICollection<Category> Categories { get; set; }
        [JsonIgnore]
        public virtual ICollection<Location> Locations { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
    }
}
