using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;
namespace EMS.Api.Endpoints;
public static class ShiftEndpoints {
    public static IEndpointRouteBuilder MapShiftEndpoints(this IEndpointRouteBuilder app) {
        var group = app.MapGroup("/api/shifts").WithTags("Shift").RequireAuthorization("AdminOnly");
        group.MapGet("", async (IApplicationDbContext db) => await db.Shifts.AsNoTracking().ToListAsync());
        group.MapPost("", async (Shift item, IApplicationDbContext db) => {
            db.Shifts.Add(item); await db.SaveChangesAsync(); return Results.Ok(item);
        });
        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) => {
            var item = await db.Shifts.FindAsync(id);
            if (item != null) { db.Shifts.Remove(item); await db.SaveChangesAsync(); }
            return Results.NoContent();
        });
        return app;
    }
}
