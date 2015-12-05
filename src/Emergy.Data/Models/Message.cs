using System;
using System.Collections.Generic;
using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Message : ModelBase
    {
        [JsonIgnore]
        public ApplicationUser Sender { get; set; }
        [JsonIgnore]
        public ApplicationUser Target { get; set; }
        public string Content { get; set; }
        public virtual ICollection<Resource> Multimedia { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
