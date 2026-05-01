using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;
namespace EMS.Api.Endpoints;
public static class SectionEndpoints {
    public static IEndpointRouteBuilder MapSectionEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/api/sections").WithTags("Section").RequireAuthorization("AdminOnly");
        group.MapGet("", async (IApplicationDbContext db) => await db.Sections.AsNoTracking().ToListAsync());
        group.MapPost("", async (Section item, IApplicationDbContext db) => {
            db.Sections.Add(item); await db.SaveChangesAsync(); return Results.Ok(item);
        });
        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) => {
            var item = await db.Sections.FindAsync(id);
            if (item != null) { db.Sections.Remove(item); await db.SaveChangesAsync(); }
            return Results.NoContent();
        });
        return app;
    }
}
