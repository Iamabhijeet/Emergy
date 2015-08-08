using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Api.Data.Configurations;
using Emergy.Api.Data.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Emergy.Api.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
          : base("DefaultConnection")
        {
        }
        /// <summary>
        ///  Ovdje mapiramo relacije iz baze podataka pomocu entity framework fluent apija.
        /// </summary>
        /// <param name="builder">Model builder</param>
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            // table mappings

            builder.Entity<Image>().ToTable("Images");

            //configurations

            builder.Configurations.Add(new ReportConfiguration());
            builder.Configurations.Add(new UnitConfiguration());
            builder.Configurations.Add(new ProfilePhotoConfiguration());
        }

        public DbSet<Unit> Units { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Image> Images { get; set; }

        public DbSet<ProfilePhoto> ProfilePhotos { get; set; }

        /// <summary>
        /// Singleton
        /// </summary>
        /// <returns></returns>
        public static ApplicationDbContext GetInstance()
        {
            return InstanceHolder.Value;
        }
        private static readonly Lazy<ApplicationDbContext> InstanceHolder = new Lazy<ApplicationDbContext>(() => new ApplicationDbContext());

        protected override void Dispose(bool disposing)
        {
           
        }
    }
}
