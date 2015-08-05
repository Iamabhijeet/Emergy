using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Emergy.Api.Data.Models.Base;

namespace Emergy.Api.Data.Models
{
    public class Unit : ModelBase
    {
        public Unit()
        {
            Clients = new HashSet<ApplicationUser>();
        }

        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }

        [ForeignKey("AdministratorId")]
        public ApplicationUser Administrator { get; set; }
        public string AdministratorId { get; set; }

        public ICollection<ApplicationUser> Clients { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
    }
}
