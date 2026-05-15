using EMS.Application.DTOs;
using EMS.Application.Interfaces;

namespace EMS.Api.Endpoints;

public static class FeeStructureEndpoints
{
    public static IEndpointRouteBuilder MapFeeStructureEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/fee-structures")
            .WithTags("Fee Structures");
            //.RequireAuthorization("AdminOnly");

        group.MapGet("", async (IFeeStructureService service) =>
            await service.GetAllAsync())
            .WithName("GetFeeStructures");

        group.MapGet("/{id:int}", async (int id, IFeeStructureService service) =>
        {
            var structure = await service.GetByIdAsync(id);
            return structure is null ? Results.NotFound() : Results.Ok(structure);
        })
        .WithName("GetFeeStructureById");

        group.MapGet("/class/{classId:int}", async (int classId, IFeeStructureService service) =>
            await service.GetByClassIdAsync(classId))
            .WithName("GetFeeStructuresByClass");

        group.MapPost("", async (CreateFeeStructureRequest request, IFeeStructureService service) =>
        {
            var created = await service.CreateAsync(request);
            return Results.Created($"/api/fee-structures/{created.Id}", created);
        })
        .WithName("CreateFeeStructure");

        group.MapPut("/{id:int}", async (int id, UpdateFeeStructureRequest request, IFeeStructureService service) =>
        {
            var updated = await service.UpdateAsync(id, request);
            return updated is null ? Results.NotFound() : Results.Ok(updated);
        })
        .WithName("UpdateFeeStructure");

        group.MapDelete("/{id:int}", async (int id, IFeeStructureService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteFeeStructure");

        return app;
    }
}
