using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using EMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class StudentEndpoints
{
    public static IEndpointRouteBuilder MapStudentEndpoints(this IEndpointRouteBuilder app)
    {
        var studentGroup = app.MapGroup("/api/students")
            .WithTags("Student")
            .RequireAuthorization("AdminOnly");

        studentGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Students.AsNoTracking().OrderBy(s => s.LastName).ToListAsync())
            .WithName("GetStudents");

        studentGroup.MapGet("/{id:int}", async (int id, IApplicationDbContext db) =>
            await db.Students.FindAsync(id) is Student student ? Results.Ok(student) : Results.NotFound())
            .WithName("GetStudentById")
            .AllowAnonymous();

        studentGroup.MapPost("", async (Student student, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Students.Add(student);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Student", student.Id.ToString(),
                $"Student {student.FirstName} {student.LastName} created.");
            return Results.Created($"/api/students/{student.Id}", student);
        })
        .WithName("CreateStudent");

        studentGroup.MapPost("/students", [Authorize("AdminOnly")] async (IApplicationDbContext db, [FromBody] StudentRequestModel request) =>
        {
            var student = new Student
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                AdmissionNumber = request.AdmissionNumber,
                ClassName = request.ClassName,
                Section = request.Section,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth
            };

            db.Students.Add(student);
            await db.SaveChangesAsync();

            return Results.Created($"/students/{student.Id}", student);
        });

        studentGroup.MapPut("/{id:int}", async (int id, Student update, IApplicationDbContext db, IAuditService audit) =>
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
        })
        .WithName("UpdateStudent");

        studentGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
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
        })
        .WithName("DeleteStudent");

        return app;
    }
}
