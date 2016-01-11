using System;
using Emergy.Data.Models.Base;

namespace Emergy.Data.Models
{
    public class Resource : ModelBase
    {
        public string Url { get; set; }
        public string Name { get; set; } = "";
        public DateTime DateUploaded { get; set; }
        public string MimeType { get; set; }
        public string Base64 { get; set; }

        public virtual Report Report { get; set; }
        public virtual Message Message { get; set; }
        public int? ReportId { get; set; }
        public int? MessageId { get; set; }
    }
}
