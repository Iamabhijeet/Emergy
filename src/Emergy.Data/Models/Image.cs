using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Image : ModelBase
    {
        public string Url { get; set; }
        public string Base64 { get; set; }
        [JsonIgnore]
        public Report Report { get; set; }
    }
}
