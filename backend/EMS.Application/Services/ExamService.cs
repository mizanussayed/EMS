using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class ExamService(IApplicationDbContext db, IAuditService audit) : IExamService
{
    public async Task<IReadOnlyList<Exam>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Exams.AsNoTracking().OrderByDescending(e => e.StartDate).ToListAsync(cancellationToken);
    }

    public async Task<Exam> CreateAsync(Exam exam, CancellationToken cancellationToken = default)
    {
        db.Exams.Add(exam);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Exam", exam.Id.ToString(), $"Exam {exam.Title} scheduled.");
        return exam;
    }

    public async Task<bool> UpdateAsync(int id, Exam update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Exams.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Title = update.Title;
        existing.Type = update.Type;
        existing.StartDate = update.StartDate;
        existing.EndDate = update.EndDate;
        existing.Status = update.Status;
        existing.ClassName = update.ClassName;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Exam", existing.Id.ToString(), $"Exam {existing.Title} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Exams.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Exams.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Exam", existing.Id.ToString(), $"Exam {existing.Title} deleted.");
        return true;
    }

    public async Task<IReadOnlyList<ExamResult>> GetResultsAsync(int examId, CancellationToken cancellationToken = default)
    {
        return await db.ExamResults
            .AsNoTracking()
            .Include(r => r.Student)
            .Where(r => r.ExamId == examId)
            .ToListAsync(cancellationToken);
    }

    public async Task<ExamResult> AddResultAsync(int examId, ExamResult result, CancellationToken cancellationToken = default)
    {
        result.ExamId = examId;
        db.ExamResults.Add(result);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "ExamResult", result.Id.ToString(), $"Result recorded for student ID {result.StudentId}.");
        return result;
    }
}