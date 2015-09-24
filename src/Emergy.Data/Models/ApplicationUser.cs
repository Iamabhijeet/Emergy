using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Threading.Tasks;
using Emergy.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;

namespace Emergy.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            Reports = new HashSet<Report>();
            Units = new HashSet<Unit>();
            Locations = new HashSet<Location>();
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType = null)
        {
            return await manager.CreateIdentityAsync(this, authenticationType);
        }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }

        [ForeignKey("ProfilePhotoId")]
        public ProfilePhoto ProfilePhoto { get; set; }

        public int ProfilePhotoId { get; set; } = 1;

        public AccountType AccountType { get; set; }
        [JsonIgnore]
        public ICollection<Location> Locations { get; set; }
        [JsonIgnore]
        public ICollection<Report> Reports { get; set; }
        [JsonIgnore]
        public ICollection<Unit> Units { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
    }


}