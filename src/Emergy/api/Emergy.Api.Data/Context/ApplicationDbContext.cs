using System;
using System.Collections.Generic;
using System.Data.Entity;
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
        /// <summary>
        ///  Ovdje mapiramo relacije iz baze podataka pomocu entity framework fluent apija.
        /// </summary>
        /// <param name="builder">Model builder</param>
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // table mappings

            builder.Entity<Image>().ToTable("Images");

            //configurations

            builder.Configurations.Add(new ReportConfiguration());
            builder.Configurations.Add(new UnitConfiguration());

        }

        public DbSet<Unit> Units { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Image> Images { get; set; }


        /// <summary>
        /// Singleton
        /// </summary>
        /// <returns></returns>
        public static ApplicationDbContext GetInstance()
        {
            return InstanceHolder.Value;
        }
        private static readonly Lazy<ApplicationDbContext> InstanceHolder = new Lazy<ApplicationDbContext>(() => new ApplicationDbContext());
    }
}
