using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class TimetableEndpoints
{
    public static IEndpointRouteBuilder MapTimetableEndpoints(this IEndpointRouteBuilder app)
    {
        var timetableGroup = app.MapGroup("/api/timetable")
            .WithTags("Timetable")
            .RequireAuthorization("AdminOnly");

        timetableGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.TimetableEntries.AsNoTracking().ToListAsync())
            .WithName("GetTimetable");

        timetableGroup.MapGet("/{className}", async (string className, IApplicationDbContext db) =>
            await db.TimetableEntries
                .AsNoTracking()
                .Where(t => t.ClassName == className)
                .OrderBy(t => t.DayOfWeek)
                .ThenBy(t => t.StartTime)
                .ToListAsync())
            .WithName("GetTimetableByClass");

        timetableGroup.MapPost("", async (TimetableEntry entry, IApplicationDbContext db, IAuditService audit) =>
        {
            db.TimetableEntries.Add(entry);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Timetable", entry.Id.ToString(), $"Timetable entry for {entry.ClassName} - {entry.SubjectName} created.");
            return Results.Created($"/api/timetable/{entry.Id}", entry);
        })
        .WithName("CreateTimetableEntry");

        timetableGroup.MapPut("/{id:int}", async (int id, TimetableEntry update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.TimetableEntries.FindAsync(id);
            if (existing is null) return Results.NotFound();

            existing.ClassName = update.ClassName;
            existing.SubjectName = update.SubjectName;
            existing.TeacherName = update.TeacherName;
            existing.DayOfWeek = update.DayOfWeek;
            existing.StartTime = update.StartTime;
            existing.EndTime = update.EndTime;
            existing.Room = update.Room;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Timetable", id.ToString(), "Timetable entry updated.");
            return Results.NoContent();
        })
        .WithName("UpdateTimetableEntry");

        timetableGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.TimetableEntries.FindAsync(id);
            if (existing is null) return Results.NotFound();

            db.TimetableEntries.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Timetable", id.ToString(), "Timetable entry deleted.");
            return Results.NoContent();
        })
        .WithName("DeleteTimetableEntry");

        return app;
    }
}
