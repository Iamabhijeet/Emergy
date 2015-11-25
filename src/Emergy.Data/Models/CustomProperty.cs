using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class CustomProperty : ModelBase
    {
        [Required]
        public string Name { get; set; }
        public virtual CustomPropertyType CustomPropertyType { get; set; }
        public virtual ICollection<CustomPropertyValue> CustomPropertyValues { get; set; }
        [JsonIgnore]
        public Unit Unit { get; set; }
    }
}
