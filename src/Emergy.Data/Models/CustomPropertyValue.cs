using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class CustomPropertyValue : ModelBase
    {
        public string SerializedValue { get; set; }
        public CustomProperty CustomProperty { get; set; }
        public ReportDetails ReportDetails { get; set; }
    }
}
