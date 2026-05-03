using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class ClassEndpoints
{
    public static IEndpointRouteBuilder MapClassEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/classes")
            .WithTags("Classes")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (IApplicationDbContext db) => await db.Classes.AsNoTracking()
        .ToListAsync());

        group.MapPost("", async (SchoolClass item, IApplicationDbContext db, IAuditService audit) =>
        {

            db.Classes.Add(item);
            await db.SaveChangesAsync();

            await audit.LogAsync("CREATE", "Class", item.Id.ToString(),
                 $"Class {item.Name} created.");
            return Results.Created($"/api/classes/{item.Id}", item);
        });

        group.MapDelete("/{id:int}", async (int id, IApplicationDbContext db) =>
        {

            var item = await db.Classes.FindAsync(id);
            if (item != null)
            {
                db.Classes.Remove(item);
                await db.SaveChangesAsync();
            }
            return Results.NoContent();
        });

        group.MapPut("/{id:int}", async (int id, SchoolClass update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Classes.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.Section = update.Section;
            existing.ClassTeacherId = update.ClassTeacherId;
            existing.Room = update.Room;
            existing.ShiftId = update.ShiftId;
            existing.NumberOfSubjects = update.NumberOfSubjects;
            existing.NumberOfStudents = update.NumberOfStudents;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "class", existing.Id.ToString(),
                $"Class {existing.Name} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateClass");


        return app;
    }
}