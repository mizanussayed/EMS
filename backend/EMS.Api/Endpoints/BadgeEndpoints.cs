using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;
namespace EMS.Api.Endpoints;
public static class BadgeEndpoints {
    public static IEndpointRouteBuilder MapBadgeEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/api/badges").WithTags("Badge").RequireAuthorization("AdminOnly");
        group.MapGet("", async (IApplicationDbContext db) => await db.StudentBadges.AsNoTracking().ToListAsync());
        group.MapPost("", async (StudentBadge item, IApplicationDbContext db) => {
            db.StudentBadges.Add(item); await db.SaveChangesAsync(); return Results.Ok(item);
        });
        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) => {
            var item = await db.StudentBadges.FindAsync(id);
            if (item != null) { db.StudentBadges.Remove(item); await db.SaveChangesAsync(); }
            return Results.NoContent();
        });
        return app;
    }
}
