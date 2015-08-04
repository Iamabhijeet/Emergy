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
    public class Report : ModelBase
    {
        public Report()
        {
            Photos = new HashSet<Image>();
        }

        [Required]
        [StringLength(50,MinimumLength = 5)]
        public string Title { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Description { get; set; }

        public ICollection<Image> Photos { get; set; }

        [ForeignKey("CreatorId")]
        public ApplicationUser Creator { get; set; }
        public int CreatorId { get; set; }

        [ForeignKey("UnitId")]
        public Unit Unit { get; set; }
        public int UnitId { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
    }
}
