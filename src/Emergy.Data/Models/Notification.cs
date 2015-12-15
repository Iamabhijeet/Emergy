using System;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;

namespace Emergy.Data.Models
{
    public class Notification : ModelBase
    {
        public ApplicationUser Sender { get; set; }
        public ApplicationUser Target { get; set; }
        public string Content { get; set; }
        public NotificationType Type { get; set; }
        public string ParameterId { get; set; }
        public DateTime Timestamp { get; set; }
    }
}

