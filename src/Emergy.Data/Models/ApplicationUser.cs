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
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType = null)
        {
            return await manager.CreateIdentityAsync(this, authenticationType);
        }

        [Required]
        public string UserKeyHash { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }

        [ForeignKey("ProfilePhotoId")]
        public virtual Resource ProfilePhoto { get; set; }

        public int ProfilePhotoId { get; set; } = 1;

        public AccountType AccountType { get; set; }
        [JsonIgnore]
        public virtual ICollection<Location> Locations { get; set; }
        [JsonIgnore]
        public virtual ICollection<Report> Reports { get; set; }
        [JsonIgnore]
        public virtual ICollection<Unit> Units { get; set; }
        [JsonIgnore]
        public virtual ICollection<Notification> SentNotifications { get; set; }
        [JsonIgnore]
        public virtual ICollection<Notification> ReceievedNotifications { get; set; }
        [JsonIgnore]
        public virtual ICollection<Message> SentMessages { get; set; }
        [JsonIgnore]
        public virtual ICollection<Message> ReceievedMessages { get; set; }
        [Required]
        public DateTime Timestamp { get; set; }
    }


}