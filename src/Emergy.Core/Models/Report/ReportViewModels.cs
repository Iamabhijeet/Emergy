using System;
using System.ComponentModel.DataAnnotations;

namespace Emergy.Core.Models.Report
{
    public class CreateReportViewModel
    {
        [StringLength(200, MinimumLength = 5)]
        public string Description { get; set; }
        [Required]
        public int UnitId { get; set; }
        public int? LocationId { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public DateTime DateHappened { get; set; } = DateTime.Now;
    }
}
