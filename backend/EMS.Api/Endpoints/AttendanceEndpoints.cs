using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using EMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class AttendanceEndpoints
{
    public static IEndpointRouteBuilder MapAttendanceEndpoints(this IEndpointRouteBuilder app)
    {
        var attendanceGroup = app.MapGroup("/api/attendance").WithTags("Attendance");

        attendanceGroup.MapGet("/{className}", async (string className, IApplicationDbContext db) =>
        {
            var attendance = await db.Attendances
                .AsNoTracking()
                .Include(a => a.Student)
                .Where(a => a.Student.ClassName == className)
                .OrderByDescending(a => a.Date)
                .ThenBy(a => a.Student.LastName)
                .Select(a => new
                {
                    a.Id,
                    a.StudentId,
                    StudentName = a.Student.FirstName + " " + a.Student.LastName,
                    a.Student.ClassName,
                    a.Date,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            return Results.Ok(attendance);
        }).WithName("GetAttendanceByClass");

        attendanceGroup.MapPost("", async (AttendanceRequest request, IApplicationDbContext db, IAuditService audit) =>
        {
            var student = await db.Students.FindAsync(request.StudentId);
            if (student is null)
            {
                return Results.BadRequest(new { message = "Student not found." });
            }

            var existing = await db.Attendances
                .FirstOrDefaultAsync(a => a.StudentId == request.StudentId && a.Date == request.Date);

            if (existing != null)
            {
                existing.Status = request.Status;
                existing.Notes = request.Notes;
                await db.SaveChangesAsync();
                await audit.LogAsync("UPDATE", "Attendance", existing.Id.ToString(),
                    $"Attendance updated for {student.FirstName} {student.LastName} on {existing.Date}.");
                return Results.Ok(existing);
            }

            var attendance = new Attendance
            {
                StudentId = request.StudentId,
                Date = request.Date,
                Status = request.Status,
                Notes = request.Notes
            };

            db.Attendances.Add(attendance);
            await db.SaveChangesAsync();

            await audit.LogAsync("CREATE", "Attendance", attendance.Id.ToString(),
                $"Attendance recorded for {student.FirstName} {student.LastName} on {attendance.Date}.");

            return Results.Created($"/api/attendance/{attendance.Id}", attendance);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateOrUpdateAttendance");

        return app;
    }
}
