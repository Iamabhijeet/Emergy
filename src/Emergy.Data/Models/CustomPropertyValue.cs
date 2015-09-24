using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class CustomPropertyValue : ModelBase
    {
        public string SerializedValue { get; set; }
        public CustomProperty CustomProperty { get; set; }
        [JsonIgnore]
        public ReportDetails ReportDetails { get; set; }
    }
}
