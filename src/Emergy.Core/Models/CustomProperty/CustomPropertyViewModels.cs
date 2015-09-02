using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.CustomProperty
{
    public class CreateCustomPropertyViewModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public CustomPropertyType CustomPropertyType { get; set; }
    }
}
