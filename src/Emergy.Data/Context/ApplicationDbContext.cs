using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using Emergy.Data.Configurations;
using Emergy.Data.Initializers;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Emergy.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
          : base("DefaultConnection")
        {
            Database.SetInitializer(new MySqlInitializer());
        }
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // builder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            // table mappings
            
            builder.Entity<Resource>().ToTable("Resources");
            

            //configurations

            builder.Entity<IdentityRole>()
               .Property(c => c.Name)
               .HasMaxLength(128)
               .IsRequired();
            builder.Entity<ApplicationUser>()
               .ToTable("AspNetUsers")
               .Property(c => c.UserName)
               .HasMaxLength(128)
               .IsRequired();
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Locations)
                .WithOptional()
                .WillCascadeOnDelete();


            builder.Configurations.Add(new ReportConfiguration());
            builder.Configurations.Add(new ReportDetailsConfiguration());
            builder.Configurations.Add(new CategoryConfiguration());
            builder.Configurations.Add(new UnitConfiguration());
            builder.Configurations.Add(new CustomPropertyConfiguration());
            builder.Configurations.Add(new CustomPropertyValueConfiguration());
        }

        public DbSet<Unit> Units { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<CustomProperty> CustomProperties { get; set; }
        public DbSet<CustomPropertyValue> CustomPropertyValues { get; set; }

        public DbSet<Location> Locations { get; set; }

        public static ApplicationDbContext Create()
        {
            Database.SetInitializer(new MySqlInitializer());
            return new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            // prevent identitydbcontext from being disposed
        }
    }
}
