using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class AttendanceService(IApplicationDbContext db, IAuditService audit) : IAttendanceService
{
    public async Task<IReadOnlyList<AttendanceDto>> GetAttendanceByClassAsync(int ClassId, CancellationToken cancellationToken = default)
    {
        return await db.Attendances
            .AsNoTracking()
            .Where(a => a.Student.ClassId == ClassId)
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.Student.Name)
            .Select(a => new AttendanceDto(
                a.Id,
                a.StudentId,
                a.Student.Name,
                a.Student.ClassId,
                a.Date,
                a.Status,
                a.Notes))
            .ToListAsync(cancellationToken);
    }

    public async Task<AttendanceUpsertResult> CreateOrUpdateAsync(AttendanceRequest request, CancellationToken cancellationToken = default)
    {
        var student = await db.Students.FindAsync([request.StudentId], cancellationToken);
        if (student is null)
        {
            return new AttendanceUpsertResult(AttendanceUpsertStatus.StudentNotFound, null, "Student not found.");
        }

        var existing = await db.Attendances
            .FirstOrDefaultAsync(a => a.StudentId == request.StudentId && a.Date == request.Date, cancellationToken);

        if (existing is not null)
        {
            existing.Status = request.Status;
            existing.Notes = request.Notes;

            await db.SaveChangesAsync(cancellationToken);

            await audit.LogAsync(
                "UPDATE",
                "Attendance",
                existing.Id.ToString(),
                $"Attendance updated for {student.Name} on {existing.Date}.");

            return new AttendanceUpsertResult(AttendanceUpsertStatus.Updated, ToDto(existing, student), null);
        }

        var attendance = new Attendance
        {
            StudentId = request.StudentId,
            Date = request.Date,
            Status = request.Status,
            Notes = request.Notes
        };

        db.Attendances.Add(attendance);
        await db.SaveChangesAsync(cancellationToken);

        await audit.LogAsync(
            "CREATE",
            "Attendance",
            attendance.Id.ToString(),
            $"Attendance recorded for {student.Name} on {attendance.Date}.");

        return new AttendanceUpsertResult(AttendanceUpsertStatus.Created, ToDto(attendance, student), null);
    }

    private static AttendanceDto ToDto(Attendance attendance, Student student)
    {
        return new AttendanceDto(
            attendance.Id,
            attendance.StudentId,
            student.Name,
            student.ClassId,
            attendance.Date,
            attendance.Status,
            attendance.Notes);
    }
}