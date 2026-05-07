using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class TimetableEndpoints
{
    public static IEndpointRouteBuilder MapTimetableEndpoints(this IEndpointRouteBuilder app)
    {
        var timetableGroup = app.MapGroup("/api/timetable")
            .WithTags("Timetable")
            .RequireAuthorization("StaffOnly");

        timetableGroup.MapGet("", async (ITimetableService timetableService) =>
            await timetableService.GetAllAsync())
            .WithName("GetTimetable");

        timetableGroup.MapGet("/{className}", async (string className, ITimetableService timetableService) =>
            await timetableService.GetByClassAsync(className))
            .WithName("GetTimetableByClass");

        timetableGroup.MapPost("", async (TimetableEntry entry, ITimetableService timetableService) =>
        {
            var created = await timetableService.CreateAsync(entry);
            return Results.Created($"/api/timetable/{created.Id}", created);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateTimetableEntry");

        timetableGroup.MapPut("/{id:int}", async (int id, TimetableEntry update, ITimetableService timetableService) =>
            await timetableService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("UpdateTimetableEntry");

        timetableGroup.MapDelete("/{id:int}", async (int id, ITimetableService timetableService) =>
            await timetableService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("DeleteTimetableEntry");

        return app;
    }
}
