using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Emergy.Data.Configurations;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Emergy.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
          : base("DefaultConnection")
        {
        }
      
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            // table mappings

            builder.Entity<Image>().ToTable("Images");
            builder.Entity<ProfilePhoto>().ToTable("ProfilePhotos");

            //configurations

            builder.Configurations.Add(new ReportConfiguration());
            builder.Configurations.Add(new UnitConfiguration());
        }

        public DbSet<Unit> Units { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Image> Images { get; set; }

        public DbSet<ProfilePhoto> ProfilePhotos { get; set; }

        public static ApplicationDbContext GetInstance()
        {
            return InstanceHolder.Value;
        }
        private static readonly Lazy<ApplicationDbContext> InstanceHolder = new Lazy<ApplicationDbContext>(() => new ApplicationDbContext());

        protected override void Dispose(bool disposing)
        {
           // prevent identitydbcontext from being disposed
        }
    }
}
