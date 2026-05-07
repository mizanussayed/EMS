using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class BadgeService(IApplicationDbContext db, IAuditService audit) : IBadgeService
{
    public async Task<IReadOnlyList<StudentBadge>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.StudentBadges.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<StudentBadge> CreateAsync(StudentBadge item, CancellationToken cancellationToken = default)
    {
        db.StudentBadges.Add(item);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Badge", item.Id.ToString(), $"Badges {item.Name} created.");
        return item;
    }

    public async Task<bool> UpdateAsync(int id, StudentBadge update, CancellationToken cancellationToken = default)
    {
        var existing = await db.StudentBadges.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Name = update.Name;
        existing.Color = update.Color;
        existing.Description = update.Description;
        existing.IsActive = update.IsActive;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Badges", existing.Id.ToString(), $"Badges {existing.Name} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.StudentBadges.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.StudentBadges.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}