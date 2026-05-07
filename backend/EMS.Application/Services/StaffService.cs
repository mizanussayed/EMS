using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class StaffService(IApplicationDbContext db, IAuditService audit) : IStaffService
{
    public async Task<IReadOnlyList<Staff>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Staff.AsNoTracking().OrderBy(s => s.Name).ToListAsync(cancellationToken);
    }

    public async Task<Staff?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Staff.FindAsync([id], cancellationToken);
    }

    public async Task<Staff> CreateAsync(Staff member, CancellationToken cancellationToken = default)
    {
        db.Staff.Add(member);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Staff", member.Id.ToString(), $"Staff member {member.Name} ({member.Role}) created.");
        return member;
    }

    public async Task<bool> UpdateAsync(int id, Staff update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Staff.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
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

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Staff", existing.Id.ToString(), $"Staff member {existing.Name} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Staff.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Staff.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Staff", existing.Id.ToString(), $"Staff member {existing.Name} deleted.");
        return true;
    }
}