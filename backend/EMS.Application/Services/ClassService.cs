using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class ClassService(IApplicationDbContext db, IAuditService audit) : IClassService
{
    public async Task<IReadOnlyList<SchoolClass>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Classes.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<SchoolClass> CreateAsync(SchoolClass item, CancellationToken cancellationToken = default)
    {
        db.Classes.Add(item);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Class", item.Id.ToString(), $"Class {item.Name} created.");
        return item;
    }

    public async Task<bool> UpdateAsync(int id, SchoolClass update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Classes.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Name = update.Name;
        existing.Section = update.Section;
        existing.ClassTeacherId = update.ClassTeacherId;
        existing.Room = update.Room;
        existing.ShiftId = update.ShiftId;
        existing.NumberOfSubjects = update.NumberOfSubjects;
        existing.NumberOfStudents = update.NumberOfStudents;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Class", existing.Id.ToString(), $"Class {existing.Name} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Classes.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Classes.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        return true;
    }
}