﻿using System;
using System.ComponentModel.DataAnnotations;
namespace Emergy.Core.Models.Unit
{
    public class CreateUnitViewModel
    {
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }
        public bool IsPublic { get; set; } = false;
        public DateTime DateCreated { get; set; } = DateTime.Now;
    }

    public class EditUnitViewModel
    {
        [Required]
        public int Id { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string Name { get; set; }
    }
}