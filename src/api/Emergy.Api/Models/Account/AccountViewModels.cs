using System;
using System.ComponentModel.DataAnnotations;
using Emergy.Data.Models.Enums;

namespace Emergy.Api.Models.Account
{
    public class User
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }

    public class RegisterUserBindingModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
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
        [Required]
        public string Country { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        public DateTime DateRegistered { get; set; } = DateTime.Now;
        [Required]
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
