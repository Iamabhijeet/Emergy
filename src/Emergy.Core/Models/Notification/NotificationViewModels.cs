using System;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.Notification
{
    public class CreateNotificationVm
    {
        [Required]
        public string Content { get; set; }
        [Required]
        public string TargetId { get; set; }
        [Required]
        public NotificationType Type { get; set; }
        [Required]
        public string ParameterId { get; set; }
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
