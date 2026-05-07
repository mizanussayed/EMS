using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class ShiftService(IApplicationDbContext db, IAuditService audit) : IShiftService
{
    public async Task<IReadOnlyList<Shift>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Shifts.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<Shift> CreateAsync(Shift item, CancellationToken cancellationToken = default)
    {
        db.Shifts.Add(item);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Shift", item.Id.ToString(), $"Shift {item.Name} created.");
        return item;
    }

    public async Task<bool> UpdateAsync(int id, Shift update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Shifts.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Name = update.Name;
        existing.StartTime = update.StartTime;
        existing.EndTime = update.EndTime;
        existing.TeacherLateTime = update.TeacherLateTime;
        existing.StudentLateTime = update.StudentLateTime;
        existing.StaffLateTime = update.StaffLateTime;
        existing.IsActive = update.IsActive;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Shift", existing.Id.ToString(), $"Shift {existing.Name} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Shifts.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Shifts.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}