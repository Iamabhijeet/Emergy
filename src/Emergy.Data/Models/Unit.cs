using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class Unit : ModelBase
    {
        public Unit()
        {
            Reports = new HashSet<Report>();
            Clients = new HashSet<ApplicationUser>();
            AdditionalProperties = new HashSet<AdditionalProperty>();
            Categories = new HashSet<Category>();
        }

        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }

        [ForeignKey("AdministratorId")]
        public ApplicationUser Administrator { get; set; }
        public string AdministratorId { get; set; }

        public ICollection<ApplicationUser> Clients { get; set; }
        public ICollection<Report> Reports { get; set; }
        public ICollection<AdditionalProperty> AdditionalProperties { get; set; }
        public ICollection<Category> Categories { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
    }
}
