using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Message
{
    public class CreateMessageVm
    {
        [Required]
        public string Content { get; set; }
        [Required]
        public string TargetId { get; set; }
        public IEnumerable<int> Multimedia { get; set; }
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
