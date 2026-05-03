using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class checkcurrent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Shifts",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "StaffLateTime",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentLateTime",
                table: "Shifts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeacherLateTime",
                table: "Shifts",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "StaffLateTime",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "StudentLateTime",
                table: "Shifts");

            migrationBuilder.DropColumn(
                name: "TeacherLateTime",
                table: "Shifts");
        }
    }
}
