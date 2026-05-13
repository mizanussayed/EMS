using EMS.Application.Interfaces;
using EMS.Domain;
namespace EMS.Api.Endpoints;

public static class BadgeEndpoints
{
    public static IEndpointRouteBuilder MapBadgeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/badges")
            .WithTags("Badges")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IBadgeService badgeService) => await badgeService.GetAllAsync());

        group.MapPost("", async (StudentBadge item, IBadgeService badgeService) =>
        {
            var created = await badgeService.CreateAsync(item);
            return Results.Created($"/api/badges/{created.Id}", created);
        });

        group.MapDelete("/{id:int}", async (int id, IBadgeService badgeService) =>
            await badgeService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

        group.MapPut("/{id:int}", async (int id, StudentBadge update, IBadgeService badgeService) =>
            await badgeService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateBadges");


        return app;
    }
}
