using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EMS.Api.Migrations
{
    /// <inheritdoc />
    public partial class checkbadclas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sections");

            migrationBuilder.DropColumn(
                name: "ClassTeacher",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "Classes");

            migrationBuilder.AddColumn<int>(
                name: "ClassTeacherId",
                table: "Classes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfStudents",
                table: "Classes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfSubjects",
                table: "Classes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShiftId",
                table: "Classes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassTeacherId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "NumberOfStudents",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "NumberOfSubjects",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "ShiftId",
                table: "Classes");

            migrationBuilder.AddColumn<string>(
                name: "ClassTeacher",
                table: "Classes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Schedule",
                table: "Classes",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Sections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClassName = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sections", x => x.Id);
                });
        }
    }
}
