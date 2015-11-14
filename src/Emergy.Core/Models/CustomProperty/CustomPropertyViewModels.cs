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
        public int UnitId { get; set; }
    }
    public class CreateCustomPropertyValueViewModel
    {
        [Required]
        public string SerializedValue { get; set; }
        [Required]
        public int PropertyId { get; set; }
    }
    public class EditCustomPropertyViewModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public CustomPropertyType CustomPropertyType { get; set; }
    }
}
