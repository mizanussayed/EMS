using EMS.Application.Interfaces;
using EMS.Domain;
using EMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class ClassEndpoints
{
    public static IEndpointRouteBuilder MapClassEndpoints(this IEndpointRouteBuilder app)
    {
        var classGroup = app.MapGroup("/api/classes")
            .WithTags("Class")
            .RequireAuthorization("AdminOnly");

        classGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Classes.AsNoTracking().OrderBy(c => c.Name).ThenBy(c => c.Section).ToListAsync())
            .WithName("GetClasses");

        classGroup.MapGet("/{id:int}", async (int id, IApplicationDbContext db) =>
            await db.Classes.FindAsync(id) is SchoolClass schoolClass ? Results.Ok(schoolClass) : Results.NotFound())
            .WithName("GetClassById");

        classGroup.MapPost("", async (SchoolClass schoolClass, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Classes.Add(schoolClass);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Class", schoolClass.Id.ToString(),
                $"Class {schoolClass.Name} {schoolClass.Section} created.");
            return Results.Created($"/api/classes/{schoolClass.Id}", schoolClass);
        })
        .WithName("CreateClass");

        classGroup.MapPut("/{id:int}", async (int id, SchoolClass update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Classes.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.Section = update.Section;
            existing.ClassTeacher = update.ClassTeacher;
            existing.Room = update.Room;
            existing.Schedule = update.Schedule;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Class", existing.Id.ToString(),
                $"Class {existing.Name} {existing.Section} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateClass");

        classGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Classes.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            db.Classes.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Class", existing.Id.ToString(),
                $"Class {existing.Name} {existing.Section} deleted.");
            return Results.NoContent();
        })
        .WithName("DeleteClass");

        return app;
    }
}
