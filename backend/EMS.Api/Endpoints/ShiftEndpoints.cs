using EMS.Application.Interfaces;
using EMS.Domain;
namespace EMS.Api.Endpoints;

public static class ShiftEndpoints
{
    public static IEndpointRouteBuilder MapShiftEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/shifts")
            .WithTags("Shift")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IShiftService shiftService) => await shiftService.GetAllAsync());

        group.MapPost("", async (Shift item, IShiftService shiftService) =>
            Results.Created($"/api/shift/{(await shiftService.CreateAsync(item)).Id}", await shiftService.CreateAsync(item)));

        group.MapDelete("/{id:int}", async (int id, IShiftService shiftService) =>
            await shiftService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

        group.MapPut("/{id:int}", async (int id, Shift update, IShiftService shiftService) =>
            await shiftService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateShift");


        return app;
    }
}
