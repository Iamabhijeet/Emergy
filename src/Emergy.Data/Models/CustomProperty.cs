using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;

namespace Emergy.Data.Models
{
    public class CustomProperty : ModelBase
    {
        [Required]
        public string Name { get; set; }
        public CustomPropertyType CustomPropertyType { get; set; }
        public CustomPropertyValue CustomPropertyValue { get; set; }
        public Unit Unit { get; set; }
    }
}
