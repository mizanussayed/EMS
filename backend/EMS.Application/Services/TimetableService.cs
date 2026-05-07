using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class TimetableService(IApplicationDbContext db, IAuditService audit) : ITimetableService
{
    public async Task<IReadOnlyList<TimetableEntry>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.TimetableEntries.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<TimetableEntry>> GetByClassAsync(string className, CancellationToken cancellationToken = default)
    {
        return await db.TimetableEntries
            .AsNoTracking()
            .Where(t => t.ClassName == className)
            .OrderBy(t => t.DayOfWeek)
            .ThenBy(t => t.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<TimetableEntry> CreateAsync(TimetableEntry entry, CancellationToken cancellationToken = default)
    {
        db.TimetableEntries.Add(entry);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Timetable", entry.Id.ToString(), $"Timetable entry for {entry.ClassName} - {entry.SubjectName} created.");
        return entry;
    }

    public async Task<bool> UpdateAsync(int id, TimetableEntry update, CancellationToken cancellationToken = default)
    {
        var existing = await db.TimetableEntries.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.ClassName = update.ClassName;
        existing.SubjectName = update.SubjectName;
        existing.TeacherName = update.TeacherName;
        existing.DayOfWeek = update.DayOfWeek;
        existing.StartTime = update.StartTime;
        existing.EndTime = update.EndTime;
        existing.Room = update.Room;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Timetable", id.ToString(), "Timetable entry updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.TimetableEntries.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.TimetableEntries.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Timetable", id.ToString(), "Timetable entry deleted.");
        return true;
    }
}