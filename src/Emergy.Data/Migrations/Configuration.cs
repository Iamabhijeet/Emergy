using System;
using System.Data.Entity.Migrations;
using System.Linq;
using Emergy.Data.Context;
using Emergy.Data.Models;
using Emergy.Data.Models.Enums;
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
            ConfigureRoles(context);
            AddDefaultProfilePhoto(context);
            CreateUsers(context);
        }

        private void ConfigureRoles(ApplicationDbContext context)
        {
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            if (!roleManager.Roles.Any())
            {
                roleManager.Create(new IdentityRole { Name = "Administrators" });
                roleManager.Create(new IdentityRole { Name = "Clients" });
            }
        }
        private void CreateUsers(ApplicationDbContext context)
        {
            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            ApplicationUser gabrijel = new ApplicationUser()
            {
                UserName = "gboduljak",
                Name = "Gabrijel",
                Surname = "Boduljak",
                Email = "gboduljak@outlook.com",
                PasswordHash = new PasswordHasher().HashPassword("damngoood"),
                Gender = Gender.Male,
                BirthDate = Convert.ToDateTime("1999-04-23"),
                ProfilePhotoId = 1
            };
            ApplicationUser boris = new ApplicationUser()
            {
                UserName = "bborovic",
                Name = "Boris",
                Surname = "Borovic",
                Email = "bborovic@outlook.com",
                PasswordHash = new PasswordHasher().HashPassword("damngoood"),
                Gender = Gender.Male,
                BirthDate = DateTime.Now,
                ProfilePhotoId = 1
            };
            ApplicationUser dummyClient = new ApplicationUser()
            {
                UserName = "dummyClient",
                Name = "Dummy",
                Surname = "Client",
                Email = "dummyClient@outlook.com",
                PasswordHash = new PasswordHasher().HashPassword("damngoood"),
                Gender = Gender.Male,
                BirthDate = DateTime.Now
            };
            manager.Create(gabrijel, gabrijel.PasswordHash);
            manager.Create(boris, boris.PasswordHash);
            manager.Create(dummyClient, dummyClient.PasswordHash);
            manager.AddToRole(gabrijel.Id, "Administrators");
            manager.AddToRole(boris.Id, "Administrators");
            manager.AddToRole(dummyClient.Id, "Clients");
        }
        private void AddDefaultProfilePhoto(ApplicationDbContext context)
        {
            context.Resources.AddOrUpdate(new Models.Resource()
            {
                Url = "/images/account/user.png"
            });
        }
    }
}
