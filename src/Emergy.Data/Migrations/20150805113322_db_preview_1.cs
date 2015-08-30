using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Migrations.Builders;
using Microsoft.Data.Entity.Migrations.Operations;

namespace EmergyApiDataMigrations
{
    public partial class db_preview_1 : Migration
    {
        public override void Up(MigrationBuilder migration)
        {
            migration.DropForeignKey(name: "FK_Report_ApplicationUser_CreatorId1", table: "Report");
            migration.DropColumn(name: "CreatorId1", table: "Report");
            migration.AlterColumn(
                name: "UserId",
                table: "AspNetUserLogins",
                type: "nvarchar(450)",
                nullable: true);
            migration.AlterColumn(
                name: "UserId",
                table: "AspNetUserClaims",
                type: "nvarchar(450)",
                nullable: true);
            migration.AlterColumn(
                name: "RoleId",
                table: "AspNetRoleClaims",
                type: "nvarchar(450)",
                nullable: true);
            migration.AlterColumn(
                name: "AdministratorId",
                table: "Unit",
                type: "nvarchar(max)",
                nullable: true);
            migration.AlterColumn(
                name: "CreatorId",
                table: "Report",
                type: "nvarchar(450)",
                nullable: true);
            migration.AddForeignKey(
                name: "FK_Report_ApplicationUser_CreatorId",
                table: "Report",
                column: "CreatorId",
                referencedTable: "AspNetUsers",
                referencedColumn: "Id");
            migration.AddForeignKey(
                name: "FK_IdentityRoleClaim<string>_IdentityRole_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId",
                referencedTable: "AspNetRoles",
                referencedColumn: "Id");
            migration.AddForeignKey(
                name: "FK_IdentityUserClaim<string>_ApplicationUser_UserId",
                table: "AspNetUserClaims",
                column: "UserId",
                referencedTable: "AspNetUsers",
                referencedColumn: "Id");
            migration.AddForeignKey(
                name: "FK_IdentityUserLogin<string>_ApplicationUser_UserId",
                table: "AspNetUserLogins",
                column: "UserId",
                referencedTable: "AspNetUsers",
                referencedColumn: "Id");
            migration.AddForeignKey(
                name: "FK_IdentityUserRole<string>_IdentityRole_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId",
                referencedTable: "AspNetRoles",
                referencedColumn: "Id");
            migration.AddForeignKey(
                name: "FK_IdentityUserRole<string>_ApplicationUser_UserId",
                table: "AspNetUserRoles",
                column: "UserId",
                referencedTable: "AspNetUsers",
                referencedColumn: "Id");
        }

        public override void Down(MigrationBuilder migration)
        {
            migration.DropForeignKey(name: "FK_Report_ApplicationUser_CreatorId", table: "Report");
            migration.DropForeignKey(name: "FK_IdentityRoleClaim<string>_IdentityRole_RoleId", table: "AspNetRoleClaims");
            migration.DropForeignKey(name: "FK_IdentityUserClaim<string>_ApplicationUser_UserId", table: "AspNetUserClaims");
            migration.DropForeignKey(name: "FK_IdentityUserLogin<string>_ApplicationUser_UserId", table: "AspNetUserLogins");
            migration.DropForeignKey(name: "FK_IdentityUserRole<string>_IdentityRole_RoleId", table: "AspNetUserRoles");
            migration.DropForeignKey(name: "FK_IdentityUserRole<string>_ApplicationUser_UserId", table: "AspNetUserRoles");
            migration.AlterColumn(
                name: "UserId",
                table: "AspNetUserLogins",
                type: "nvarchar(max)",
                nullable: true);
            migration.AlterColumn(
                name: "UserId",
                table: "AspNetUserClaims",
                type: "nvarchar(max)",
                nullable: true);
            migration.AlterColumn(
                name: "RoleId",
                table: "AspNetRoleClaims",
                type: "nvarchar(max)",
                nullable: true);
            migration.AlterColumn(
                name: "AdministratorId",
                table: "Unit",
                type: "int",
                nullable: false);
            migration.AlterColumn(
                name: "CreatorId",
                table: "Report",
                type: "int",
                nullable: false);
            migration.AddColumn(
                name: "CreatorId1",
                table: "Report",
                type: "nvarchar(450)",
                nullable: true);
            migration.AddForeignKey(
                name: "FK_Report_ApplicationUser_CreatorId1",
                table: "Report",
                column: "CreatorId1",
                referencedTable: "AspNetUsers",
                referencedColumn: "Id");
        }
    }
}
