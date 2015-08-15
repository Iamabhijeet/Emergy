
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;

namespace Emergy.Data.Models
{
    public class AdditionalProperty : ModelBase
    {
        public string Name { get; set; }
        public string TextValue { get; set; }
        public string BoolValue { get; set; }
        public AdditionalPropertyType Type { get; set; }
    }
}
