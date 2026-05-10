using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class ClassEndpoints
{
    public static IEndpointRouteBuilder MapClassEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/classes")
            .WithTags("Classes");

        group.MapGet("", async (IClassService classService) => await classService.GetAllAsync())
            .RequireAuthorization("StaffOnly");

        group.MapPost("", async (SchoolClass item, IClassService classService) =>
        {
            var created = await classService.CreateAsync(item);
            return Results.Created($"/api/classes/{created.Id}", created);
        })
        .RequireAuthorization("AdminOnly");

        group.MapDelete("/{id:int}", async (int id, IClassService classService) =>
            await classService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly");

        group.MapPut("/{id:int}", async (int id, SchoolClass update, IClassService classService) =>
            await classService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("UpdateClass");


        return app;
    }
}
