using System;
using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Notification : ModelBase
    {
        public ApplicationUser Sender { get; set; }
        public ApplicationUser Target { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}

