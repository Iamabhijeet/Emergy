using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class CustomPropertyValue : ModelBase
    {
        public string SerializedValue { get; set; }
        public virtual CustomProperty CustomProperty { get; set; }
        [JsonIgnore]
        public virtual ReportDetails ReportDetails { get; set; }
    }
}
