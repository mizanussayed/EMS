using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class SubjectService(IApplicationDbContext db, IAuditService audit) : ISubjectService
{
    public async Task<IReadOnlyList<Subject>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Subjects.AsNoTracking().OrderBy(s => s.Name).ToListAsync(cancellationToken);
    }

    public async Task<Subject?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Subjects.FindAsync([id], cancellationToken);
    }

    public async Task<Subject> CreateAsync(Subject subject, CancellationToken cancellationToken = default)
    {
        db.Subjects.Add(subject);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Subject", subject.Id.ToString(), $"Subject {subject.Name} ({subject.Code}) created.");
        return subject;
    }

    public async Task<bool> UpdateAsync(int id, Subject update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Subjects.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Name = update.Name;
        existing.Code = update.Code;
        existing.Teacher = update.Teacher;
        existing.Classes = update.Classes;
        existing.Credits = update.Credits;
        existing.Type = update.Type;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Subject", existing.Id.ToString(), $"Subject {existing.Name} ({existing.Code}) updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Subjects.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Subjects.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Subject", existing.Id.ToString(), $"Subject {existing.Name} ({existing.Code}) deleted.");
        return true;
    }
}