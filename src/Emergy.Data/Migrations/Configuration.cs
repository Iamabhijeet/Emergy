using System;
using System.Data.Entity.Migrations;
using System.Linq;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Emergy.Data.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            SetSqlGenerator("MySql.Data.MySqlClient", new MySql.Data.Entity.MySqlMigrationSqlGenerator());
            SetHistoryContextFactory("MySql.Data.MySqlClient", (conn, schema) => new MySqlHistoryContext(conn, schema));
        }

        protected override void Seed(ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            ConfigureAuth();
            AddDefaultProfilePhoto(context);
        }

        private void ConfigureAuth()
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));

            if (!roleManager.Roles.Any())
            {
                roleManager.Create(new IdentityRole { Name = "Clients" });
                roleManager.Create(new IdentityRole { Name = "Administrators" });
            }

        }
        private void AddDefaultProfilePhoto(ApplicationDbContext context)
        {
            context.ProfilePhotos.AddOrUpdate(new Models.ProfilePhoto
            {
                Url="/images/account/user.png"
            });
        }
    }
}
