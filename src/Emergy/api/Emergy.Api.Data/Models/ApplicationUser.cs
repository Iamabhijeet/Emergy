using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Emergy.Api.Data.Configurations;
using Emergy.Api.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;


namespace Emergy.Api.Data.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            Reports = new HashSet<Report>();
            Units = new HashSet<Unit>();
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType = null)
        {
            return await manager.CreateIdentityAsync(this, authenticationType);
        }



        public ICollection<Report> Reports { get; set; }
        public ICollection<Unit> Units { get; set; }

        public AccountType AccountType { get; set; }
        public AccountPlan AccountPlan { get; set; }
    }


}