using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.Report
{
    public class CreateReportViewModel
    {
        public string Description { get; set; }
        [Required]
        public int UnitId { get; set; }
        public int? LocationId { get; set; }
        [Required]
        public int? CategoryId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public DateTime DateHappened { get; set; } = DateTime.Now;
    }
    public class ReportDetailsViewModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public Data.Models.Unit Unit { get; set; }
        public ApplicationUser Creator { get; set; }
        public string CreatorId { get; set; }
        public virtual Data.Models.Location Location { get; set; }
        public int? LocationId { get; set; }
        public Category Category { get; set; }
        public int? CategoryId { get; set; }
        public ReportDetails Details { get; set; }
        public int DetailsId { get; set; }
        public DateTime Timestamp { get; set; }
        public DateTime DateHappened { get; set; }
        public ReportStatus Status { get; set; }
        public ICollection<Resource> Resources { get; set; }
    }
}
