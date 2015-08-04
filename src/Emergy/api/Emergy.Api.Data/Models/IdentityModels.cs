using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Emergy.Api.Data.Models.Enums;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata.Builders;
using Microsoft.Framework.OptionsModel;

namespace Emergy.Api.Data.Models
{
    public class ApplicationUser : IdentityUser
    {

        public ICollection<Report> Reports { get; set; }
        public ICollection<Unit> Units { get; set; }

        public AccountType AccountType { get; set; }
        public AccountPlan AccountPlan { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}