
using System;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Unit
{
    public class CreateUnitViewModel
    {
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }
        public string AdministratorId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }
}
