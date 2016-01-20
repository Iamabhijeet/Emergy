using System;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Assignment : ModelBase
    {
        public virtual Report Report { get; set; }
        [Required]
        public int ReportId { get; set; }
        [JsonIgnore]
        public virtual ApplicationUser Target { get; set; }
        [Required]
        public string TargetId { get; set; }
        [JsonIgnore]
        public virtual ApplicationUser Admin { get; set; }
        [Required]
        public string AdminId { get; set; }
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
