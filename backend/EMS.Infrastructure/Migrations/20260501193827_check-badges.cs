using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class checkbadges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "StudentBadges",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "StudentBadges",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "StudentBadges");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "StudentBadges");
        }
    }
}
