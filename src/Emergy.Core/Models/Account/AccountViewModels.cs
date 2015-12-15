using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;

namespace Emergy.Core.Models.Account
{
    public class UserProfile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public Resource ProfilePhoto { get; set; }
        public int ProfilePhotoId { get; set; } = 1;
        public AccountType AccountType { get; set; }
        public ICollection<Data.Models.Location> Locations { get; set; }
        public ICollection<Data.Models.Report> Reports { get; set; }
        public ICollection<Data.Models.Unit> Units { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
    }

    public class RegisterUserBindingModel
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime DateRegistered { get; set; } = DateTime.Now;
        [Required]
        public AccountType AccountType { get; set; }
        public Gender Gender { get; set; }
    }

    public class LoginUserBindingModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
