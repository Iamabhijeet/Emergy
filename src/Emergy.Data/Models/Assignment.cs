﻿using System;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Base;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class Assignment : ModelBase
    {
        [Required]
        [JsonIgnore]
        public virtual Report Report { get; set; }
        public int ReportId { get; set; }
        [Required]
        public virtual ApplicationUser Target { get; set; }
        public string TargetId { get; set; }
        [Required]
        public virtual ApplicationUser Admin { get; set; }
        public string AdminId { get; set; }
        [Required]
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
