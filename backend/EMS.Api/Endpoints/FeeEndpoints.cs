using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class FeeEndpoints
{
    public static IEndpointRouteBuilder MapFeeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/fees")
            .WithTags("Fees");
            //.RequireAuthorization("AdminOnly");

        group.MapGet("", async (IFeeService feeService) =>
            await feeService.GetAllAsync())
            .WithName("GetFees");

        group.MapPost("", async (Fee fee, IFeeService feeService) =>
        {
            var created = await feeService.CreateAsync(fee);
            return Results.Created($"/api/fees/{created.Id}", created);
        })
        .WithName("CreateFeeRecord");

        group.MapPut("/{id:int}/pay", async (int id, FeePaymentRequest request, IFeeService feeService) =>
        {
            var updated = await feeService.ProcessPaymentAsync(id, request);
            return updated is null ? Results.NotFound() : Results.Ok(updated);
        })
        .WithName("ProcessPayment");

        return app;
    }
}

