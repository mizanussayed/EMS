using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class FeeService(IApplicationDbContext db, IAuditService audit) : IFeeService
{
    public async Task<IReadOnlyList<FeeDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Fees
            .AsNoTracking()
            .Select(f => new FeeDto(
                f.Id,
                f.StudentId,
                f.Student.FirstName + " " + f.Student.LastName,
                f.Student.ClassName,
                f.Month,
                f.Amount,
                f.PaidAmount,
                f.Status,
                f.PaymentDate,
                f.PaymentMethod))
            .ToListAsync(cancellationToken);
    }

    public async Task<Fee> CreateAsync(Fee fee, CancellationToken cancellationToken = default)
    {
        db.Fees.Add(fee);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Fee", fee.Id.ToString(), $"Fee record for student ID {fee.StudentId} created.");
        return fee;
    }

    public async Task<FeeDto?> ProcessPaymentAsync(int id, FeePaymentRequest request, CancellationToken cancellationToken = default)
    {
        var fee = await db.Fees.Include(f => f.Student).FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        if (fee is null)
        {
            return null;
        }

        fee.PaidAmount += request.Amount;
        fee.PaymentDate = DateTime.UtcNow;
        fee.PaymentMethod = request.Method;

        if (fee.PaidAmount >= fee.Amount)
        {
            fee.Status = "Paid";
        }
        else if (fee.PaidAmount > 0)
        {
            fee.Status = "Partially Paid";
        }

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Fee", id.ToString(), $"Payment of {request.Amount} received.");

        return new FeeDto(
            fee.Id,
            fee.StudentId,
            fee.Student.FirstName + " " + fee.Student.LastName,
            fee.Student.ClassName,
            fee.Month,
            fee.Amount,
            fee.PaidAmount,
            fee.Status,
            fee.PaymentDate,
            fee.PaymentMethod);
    }
}