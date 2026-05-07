using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class ClassEndpoints
{
    public static IEndpointRouteBuilder MapClassEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/classes")
            .WithTags("Classes")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IClassService classService) => await classService.GetAllAsync());

        group.MapPost("", async (SchoolClass item, IClassService classService) =>
        {
            var created = await classService.CreateAsync(item);
            return Results.Created($"/api/classes/{created.Id}", created);
        });

        group.MapDelete("/{id:int}", async (int id, IClassService classService) =>
            await classService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

        group.MapPut("/{id:int}", async (int id, SchoolClass update, IClassService classService) =>
            await classService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateClass");


        return app;
    }
}