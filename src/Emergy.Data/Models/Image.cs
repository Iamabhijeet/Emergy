using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class Image : ModelBase
    {
        public string Url { get; set; }
        public string Base64 { get; set; }
        public Report Report { get; set; }
    }
}
