﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Emergy.Data.Models.Base;
using Emergy.Data.Models.Enums;

namespace Emergy.Data.Models
{
    public class Report : ModelBase
    {
        public Report()
        {
            Photos = new HashSet<Image>();
        }

        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Title { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 5)]
        public string Description { get; set; }

        public Unit Unit { get; set; }

        [ForeignKey("CreatorId")]
        public ApplicationUser Creator { get; set; }
        public string CreatorId { get; set; }

        [ForeignKey("LocationId")]
        public Location Location { get; set; }
        public int LocationId { get; set; }

        [ForeignKey("DetailsId")]
        public ReportDetails Details { get; set; }
        public int DetailsId { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }
        public DateTime DateHappened { get; set; }

        public ReportStatus Status { get; set; }
        public ICollection<Image> Photos { get; set; }

    }
}
