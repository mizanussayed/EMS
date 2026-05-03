using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;
namespace EMS.Api.Endpoints;

public static class BadgeEndpoints
{
    public static IEndpointRouteBuilder MapBadgeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/badges")
            .WithTags("Badges")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IApplicationDbContext db) => await db.StudentBadges.AsNoTracking()
        .ToListAsync());

        group.MapPost("", async (StudentBadge item, IApplicationDbContext db, IAuditService audit) =>
        {

            db.StudentBadges.Add(item);
            await db.SaveChangesAsync();

            await audit.LogAsync("CREATE", "Badge", item.Id.ToString(),
                 $"Badges {item.Name} created.");
            return Results.Created($"/api/badges/{item.Id}", item);
        });

        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) =>
        {

            var item = await db.StudentBadges.FindAsync(id);
            if (item != null)
            {
                db.StudentBadges.Remove(item);
                await db.SaveChangesAsync();
            }
            return Results.NoContent();
        });

        group.MapPut("/{id:int}", async (int id, StudentBadge update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.StudentBadges.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.Color = update.Color;
            existing.Description = update.Description;
            existing.IsActive = update.IsActive;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Badges", existing.Id.ToString(),
                $"Badges {existing.Name} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateBadges");


        return app;
    }
}
