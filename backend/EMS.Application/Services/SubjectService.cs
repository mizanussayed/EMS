using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class SubjectService(IApplicationDbContext db, IAuditService audit) : ISubjectService
{
    public async Task<IReadOnlyList<SubjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Subjects
            .AsNoTracking()
            .LeftJoin(db.Staff, s => s.TeacherId, t => t.Id, (s, t) => new { Subject = s, Teacher = t })
            .LeftJoin(db.Classes, st => st.Subject.ClassId, c => c.Id, (st, c) => new { st.Subject, st.Teacher, Class = c })
            .OrderBy(s=> s.Class!.Id)
            .Select(s => MapToDto(s.Subject, s.Teacher!.Name, s.Class!.Name))
            .ToListAsync(cancellationToken);
    }

    public async Task<SubjectDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var subject = await db.Subjects.FindAsync([id], cancellationToken);
        if (subject is null)
        {
            return null;
        }

        var teacher = await db.Staff.FindAsync([subject.TeacherId], cancellationToken);
        var className = await db.Classes.Where(c => c.Id == subject.ClassId).Select(c => c.Name).FirstOrDefaultAsync(cancellationToken);

        return MapToDto(subject, teacher?.Name ?? string.Empty, className ?? string.Empty);

    }

    public async Task<SubjectDto> CreateAsync(Subject subject, CancellationToken cancellationToken = default)
    {
        db.Subjects.Add(subject);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Subject", subject.Id.ToString(), $"Subject {subject.Name} ({subject.Code}) created.");
        return MapToDto(subject, string.Empty, string.Empty);
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
        existing.TeacherId = update.TeacherId;
        existing.ClassId = update.ClassId;
        existing.FullMarks = update.FullMarks;
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


    private static SubjectDto MapToDto(Subject subject, string teacherName, string className)
    {
        return new SubjectDto(
            subject.Id,
            subject.Name,
            subject.Code,
            subject.TeacherId,
            subject.ClassId,
            subject.FullMarks,
            subject.Type,
            teacherName,
            className
        );
    }
}