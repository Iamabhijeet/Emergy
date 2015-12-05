using System;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Notification
{
    public class CreateNotificationVm
    {
        [Required]
        public string Content { get; set; }
        [Required]
        public string TargetId { get; set; }
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
