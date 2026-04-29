using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class FeeEndpoints
{
    public static IEndpointRouteBuilder MapFeeEndpoints(this IEndpointRouteBuilder app)
    {
        var feeGroup = app.MapGroup("/api/fees")
            .WithTags("Fees")
            .RequireAuthorization("AdminOnly");

        feeGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Fees
                .AsNoTracking()
                .Include(f => f.Student)
                .Select(f => new
                {
                    f.Id,
                    f.StudentId,
                    StudentName = f.Student.FirstName + " " + f.Student.LastName,
                    f.Student.ClassName,
                    f.Month,
                    f.Amount,
                    f.PaidAmount,
                    f.Status,
                    f.PaymentDate,
                    f.PaymentMethod
                })
                .ToListAsync())
            .WithName("GetFees");

        feeGroup.MapPost("", async (Fee fee, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Fees.Add(fee);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Fee", fee.Id.ToString(), $"Fee record for student ID {fee.StudentId} created.");
            return Results.Created($"/api/fees/{fee.Id}", fee);
        })
        .WithName("CreateFeeRecord");

        feeGroup.MapPut("/{id:int}/pay", async (int id, PaymentRequest request, IApplicationDbContext db, IAuditService audit) =>
        {
            var fee = await db.Fees.FindAsync(id);
            if (fee is null) return Results.NotFound();

            fee.PaidAmount += request.Amount;
            fee.PaymentDate = DateTime.UtcNow;
            fee.PaymentMethod = request.Method;

            if (fee.PaidAmount >= fee.Amount)
                fee.Status = "Paid";
            else if (fee.PaidAmount > 0)
                fee.Status = "Partially Paid";

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Fee", id.ToString(), $"Payment of {request.Amount} received.");
            return Results.Ok(fee);
        })
        .WithName("ProcessPayment");

        return app;
    }
}

public record PaymentRequest(double Amount, string Method);
