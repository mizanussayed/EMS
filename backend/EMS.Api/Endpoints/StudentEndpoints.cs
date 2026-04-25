using EMS.Api.Data;
using EMS.Api.Models;
using EMS.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class StudentEndpoints
{
    public static IEndpointRouteBuilder MapStudentEndpoints(this IEndpointRouteBuilder app)
    {
        var studentGroup = app.MapGroup("/api/students");

        studentGroup.MapGet("", async (AppDbContext db) =>
            await db.Students.AsNoTracking().OrderBy(s => s.LastName).ToListAsync())
            .WithName("GetStudents");

        studentGroup.MapGet("/{id:int}", async (int id, AppDbContext db) =>
            await db.Students.FindAsync(id) is Student student ? Results.Ok(student) : Results.NotFound())
            .WithName("GetStudentById");

        studentGroup.MapPost("", async (Student student, AppDbContext db, IAuditService audit) =>
        {
            db.Students.Add(student);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Student", student.Id.ToString(),
                $"Student {student.FirstName} {student.LastName} created.");
            return Results.Created($"/api/students/{student.Id}", student);
        }).RequireAuthorization("StaffOnly")
        .WithName("CreateStudent");

        studentGroup.MapPut("/{id:int}", async (int id, Student update, AppDbContext db, IAuditService audit) =>
        {
            var existing = await db.Students.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.FirstName = update.FirstName;
            existing.LastName = update.LastName;
            existing.AdmissionNumber = update.AdmissionNumber;
            existing.ClassName = update.ClassName;
            existing.Section = update.Section;
            existing.DateOfBirth = update.DateOfBirth;
            existing.Gender = update.Gender;
            existing.Active = update.Active;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Student", existing.Id.ToString(),
                $"Student {existing.FirstName} {existing.LastName} updated.");
            return Results.NoContent();
        }).RequireAuthorization("StaffOnly")
        .WithName("UpdateStudent");

        studentGroup.MapDelete("/{id:int}", async (int id, AppDbContext db, IAuditService audit) =>
        {
            var existing = await db.Students.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            db.Students.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Student", existing.Id.ToString(),
                $"Student {existing.FirstName} {existing.LastName} deleted.");
            return Results.NoContent();
        }).RequireAuthorization("StaffOnly")
        .WithName("DeleteStudent");

        return app;
    }
}
