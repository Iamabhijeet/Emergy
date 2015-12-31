using System;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Assignment
{
    public class CreateAssigmentVm
    {
        [Required]
        public int ReportId { get; set; }
        [Required]
        public string TargetId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
