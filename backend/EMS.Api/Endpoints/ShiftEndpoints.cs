using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;
namespace EMS.Api.Endpoints;

public static class ShiftEndpoints
{
    public static IEndpointRouteBuilder MapShiftEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/shifts")
            .WithTags("Shift")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IApplicationDbContext db) => await db.Shifts.AsNoTracking()
        .ToListAsync());

        group.MapPost("", async (Shift item, IApplicationDbContext db, IAuditService audit) =>
        {

            db.Shifts.Add(item);
            await db.SaveChangesAsync();

            await audit.LogAsync("CREATE", "Shift", item.Id.ToString(),
                 $"Shift {item.Name} created.");
            return Results.Created($"/api/shift/{item.Id}", item);
        });

        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) =>
        {

            var item = await db.Shifts.FindAsync(id);
            if (item != null)
            {
                db.Shifts.Remove(item);
                await db.SaveChangesAsync();
            }
            return Results.NoContent();
        });

        group.MapPut("/{id:int}", async (int id, Shift update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Shifts.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.StartTime = update.StartTime;
            existing.EndTime = update.EndTime;
            existing.TeacherLateTime = update.TeacherLateTime;
            existing.StudentLateTime = update.StudentLateTime;
            existing.StaffLateTime = update.StaffLateTime;
            existing.IsActive = update.IsActive;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "shift", existing.Id.ToString(),
                $"Shift {existing.Name} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateShift");


        return app;
    }
}
