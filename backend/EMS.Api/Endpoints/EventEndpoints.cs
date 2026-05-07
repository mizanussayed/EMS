using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class EventEndpoints
{
    public static IEndpointRouteBuilder MapEventEndpoints(this IEndpointRouteBuilder app)
    {
        var eventGroup = app.MapGroup("/api/events")
            .WithTags("Events")
            .RequireAuthorization();

        eventGroup.MapGet("", async (IEventService eventService) =>
            await eventService.GetAllAsync())
            .WithName("GetEvents");

        eventGroup.MapPost("", async (Event @event, IEventService eventService) =>
        {
            var created = await eventService.CreateAsync(@event);
            return Results.Created($"/api/events/{created.Id}", created);
        })
        .WithName("CreateEvent")
        .RequireAuthorization("AdminOnly");

        eventGroup.MapPut("/{id:int}", async (int id, Event update, IEventService eventService) =>
            await eventService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateEvent")
        .RequireAuthorization("AdminOnly");

        eventGroup.MapDelete("/{id:int}", async (int id, IEventService eventService) =>
            await eventService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .WithName("DeleteEvent")
        .RequireAuthorization("AdminOnly");

        return app;
    }
}
