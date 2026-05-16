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
            .LeftJoin(db.Students, f => f.StudentId, s => s.Id, (f, s) => new { Fee = f, Student = s })
            .Select(f => new FeeDto(
                f.Fee.Id,
                f.Fee.StudentId,
                f.Student != null ? f.Student.Name : string.Empty,
                f.Student != null ? f.Student.ClassId : 0,
                f.Fee.Month,
                f.Fee.Amount,
                f.Fee.PaidAmount,
                f.Fee.Status,
                f.Fee.PaymentDate.ToDateTime(new TimeOnly(0, 0)),
                f.Fee.PaymentMethod))
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

        var fee = await db.Fees
            .Join(db.Students, f => f.StudentId, s => s.Id, (f, s) => new { Fee = f, Student = s })
            .FirstOrDefaultAsync(cancellationToken);

        if (fee is null)
        {
            return null;
        }

        fee.Fee.PaidAmount += request.Amount;
        fee.Fee.PaymentMethod = request.Method;
        fee.Fee.PaymentDate = DateOnly.FromDateTime(DateTime.UtcNow);

        if (fee.Fee.PaidAmount >= fee.Fee.Amount)
        {
            fee.Fee.Status = "Paid";
        }
        else if (fee.Fee.PaidAmount > 0)
        {
            fee.Fee.Status = "Partially Paid";
        }

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Fee", id.ToString(), $"Payment of {request.Amount} received.");

        return new FeeDto(
            fee.Fee.Id,
            fee.Fee.StudentId,
            fee.Student.Name,
            fee.Student.ClassId,
            fee.Fee.Month,
            fee.Fee.Amount,
            fee.Fee.PaidAmount,
            fee.Fee.Status,
            fee.Fee.PaymentDate.ToDateTime(new TimeOnly(0, 0)),
            fee.Fee.PaymentMethod);
    }
}