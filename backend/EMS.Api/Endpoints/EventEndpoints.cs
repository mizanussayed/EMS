using EMS.Application.Interfaces;
using EMS.Domain;
using EMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
