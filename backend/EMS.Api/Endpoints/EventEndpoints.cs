using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class EventEndpoints
{
    public static IEndpointRouteBuilder MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        var eventGroup = app.MapGroup("/api/events")
            .WithTags("Events")
            .RequireAuthorization();

        eventGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Events.AsNoTracking().OrderBy(e => e.StartDate).ToListAsync())
            .WithName("GetEvents");

        eventGroup.MapPost("", async (Event @event, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Events.Add(@event);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Event", @event.Id.ToString(), $"Event {@event.Title} created.");
            return Results.Created($"/api/events/{@event.Id}", @event);
        })
        .WithName("CreateEvent")
        .RequireAuthorization("AdminOnly");

        eventGroup.MapPut("/{id:int}", async (int id, Event update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Events.FindAsync(id);
            if (existing is null)
                return Results.NotFound();

            existing.Title = update.Title;
            existing.Description = update.Description;
            existing.StartDate = update.StartDate;
            existing.EndDate = update.EndDate;
            existing.Location = update.Location;
            existing.OrganizedBy = update.OrganizedBy;
            existing.IsActive = update.IsActive;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Event", existing.Id.ToString(), $"Event {existing.Title} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateEvent")
        .RequireAuthorization("AdminOnly");

        eventGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Events.FindAsync(id);
            if (existing is null) return Results.NotFound();

            db.Events.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Event", id.ToString(), "Event deleted.");
            return Results.NoContent();
        })
        .WithName("DeleteEvent")
        .RequireAuthorization("AdminOnly");

        return app;
    }
}
