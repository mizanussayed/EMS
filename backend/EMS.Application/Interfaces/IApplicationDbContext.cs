using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<AppUser> Users { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Student> Students { get; }
    DbSet<Attendance> Attendances { get; }
    DbSet<SchoolClass> Classes { get; }
    DbSet<Shift> Shifts { get; }
    DbSet<StudentBadge> StudentBadges { get; }
    DbSet<Subject> Subjects { get; }
    DbSet<Staff> Staff { get; }
    DbSet<Exam> Exams { get; }
    DbSet<ExamResult> ExamResults { get; }
    DbSet<TimetableEntry> TimetableEntries { get; }
    DbSet<Fee> Fees { get; }
    DbSet<FeeStructure> FeeStructures { get; }
    DbSet<Book> Books { get; }
    DbSet<BookIssue> BookIssues { get; }
    DbSet<Event> Events { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
