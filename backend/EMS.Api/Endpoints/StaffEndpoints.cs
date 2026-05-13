using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class StaffEndpoints
{
    public static IEndpointRouteBuilder MapStaffEndpoints(this IEndpointRouteBuilder app)
    {
        var staffGroup = app.MapGroup("/api/staff")
            .WithTags("Staff")
            .RequireAuthorization("StaffOnly");

        staffGroup.MapGet("", async (IStaffService staffService) =>
            await staffService.GetAllAsync())
            .WithName("GetStaff");

        staffGroup.MapGet("/{id:int}", async (int id, IStaffService staffService) =>
            await staffService.GetByIdAsync(id) is Staff member ? Results.Ok(member) : Results.NotFound())
            .WithName("GetStaffById");

        staffGroup.MapPost("", async (Staff member, IStaffService staffService) =>
        {
            var created = await staffService.CreateAsync(member);
            return Results.Created($"/api/staff/{created.Id}", created);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateStaff");

        staffGroup.MapPut("/{id:int}", async (int id, Staff update, IStaffService staffService) =>
            await staffService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("UpdateStaff");

        staffGroup.MapDelete("/{id:int}", async (int id, IStaffService staffService) =>
            await staffService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("DeleteStaff");

        return app;
    }
}
