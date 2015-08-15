using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class ProfilePhoto : ModelBase
    {
        public string Url { get; set; }
        public byte[] Base64 { get; set; }
    }
}
