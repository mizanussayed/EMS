using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class SubjectEndpoints
{
    public static IEndpointRouteBuilder MapSubjectEndpoints(this IEndpointRouteBuilder app)
    {
        var subjectGroup = app.MapGroup("/api/subjects")
            .WithTags("Subject")
            .RequireAuthorization("AdminOnly");

        subjectGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Subjects.AsNoTracking().OrderBy(s => s.Name).ToListAsync())
            .WithName("GetSubjects");

        subjectGroup.MapGet("/{id:int}", async (int id, IApplicationDbContext db) =>
            await db.Subjects.FindAsync(id) is Subject subject ? Results.Ok(subject) : Results.NotFound())
            .WithName("GetSubjectById");

        subjectGroup.MapPost("", async (Subject subject, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Subjects.Add(subject);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Subject", subject.Id.ToString(),
                $"Subject {subject.Name} ({subject.Code}) created.");
            return Results.Created($"/api/subjects/{subject.Id}", subject);
        })
        .WithName("CreateSubject");

        subjectGroup.MapPut("/{id:int}", async (int id, Subject update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Subjects.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.Code = update.Code;
            existing.Teacher = update.Teacher;
            existing.Classes = update.Classes;
            existing.Credits = update.Credits;
            existing.Type = update.Type;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Subject", existing.Id.ToString(),
                $"Subject {existing.Name} ({existing.Code}) updated.");
            return Results.NoContent();
        })
        .WithName("UpdateSubject");

        subjectGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Subjects.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            db.Subjects.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Subject", existing.Id.ToString(),
                $"Subject {existing.Name} ({existing.Code}) deleted.");
            return Results.NoContent();
        })
        .WithName("DeleteSubject");

        return app;
    }
}
