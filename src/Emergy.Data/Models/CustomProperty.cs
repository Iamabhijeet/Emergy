using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class CustomProperty : ModelBase
    {
        public CustomProperty()
        {
            CustomPropertyValues = new HashSet<CustomPropertyValue>();
        }
        [Required]
        public string Name { get; set; }
        public CustomPropertyType CustomPropertyType { get; set; }
        public ICollection<CustomPropertyValue> CustomPropertyValues { get; set; }
        [JsonIgnore]
        public Unit Unit { get; set; }
    }
}
