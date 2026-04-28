using EMS.Application.Interfaces;
using EMS.Domain;
using EMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class StaffEndpoints
{
    public static IEndpointRouteBuilder MapStaffEndpoints(this IEndpointRouteBuilder app)
    {
        var staffGroup = app.MapGroup("/api/staff")
            .WithTags("Staff")
            .RequireAuthorization("AdminOnly");

        staffGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Staff.AsNoTracking().OrderBy(s => s.Name).ToListAsync())
            .WithName("GetStaff");

        staffGroup.MapGet("/{id:int}", async (int id, IApplicationDbContext db) =>
            await db.Staff.FindAsync(id) is Staff member ? Results.Ok(member) : Results.NotFound())
            .WithName("GetStaffById");

        staffGroup.MapPost("", async (Staff member, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Staff.Add(member);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Staff", member.Id.ToString(),
                $"Staff member {member.Name} ({member.Role}) created.");
            return Results.Created($"/api/staff/{member.Id}", member);
        })
        .WithName("CreateStaff");

        staffGroup.MapPut("/{id:int}", async (int id, Staff update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Staff.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            existing.Name = update.Name;
            existing.Subject = update.Subject;
            existing.Email = update.Email;
            existing.Phone = update.Phone;
            existing.Qualification = update.Qualification;
            existing.Experience = update.Experience;
            existing.Classes = update.Classes;
            existing.Status = update.Status;
            existing.Address = update.Address;
            existing.DateOfJoining = update.DateOfJoining;
            existing.Role = update.Role;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Staff", existing.Id.ToString(),
                $"Staff member {existing.Name} updated.");
            return Results.NoContent();
        })
        .WithName("UpdateStaff");

        staffGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Staff.FindAsync(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            db.Staff.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Staff", existing.Id.ToString(),
                $"Staff member {existing.Name} deleted.");
            return Results.NoContent();
        })
        .WithName("DeleteStaff");

        return app;
    }
}
