using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Migrations.Builders;
using Microsoft.Data.Entity.Migrations.Operations;

namespace EmergyApiDataMigrations
{
    public partial class db_preview_2 : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
        }

        public override void Down(MigrationBuilder migration)
        {
            migration.DropTable("Image");
            migration.DropTable("AspNetRoleClaims");
            migration.DropTable("AspNetUserClaims");
            migration.DropTable("AspNetUserLogins");
            migration.DropTable("AspNetUserRoles");
            migration.DropTable("Report");
            migration.DropTable("AspNetRoles");
            migration.DropTable("AspNetUsers");
            migration.DropTable("Unit");
        }
    }
}
