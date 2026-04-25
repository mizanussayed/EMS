using EMS.Api.Contracts;
using EMS.Api.Data;
using EMS.Api.Models;
using EMS.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class AttendanceEndpoints
{
    public static IEndpointRouteBuilder MapAttendanceEndpoints(this IEndpointRouteBuilder app)
    {
        var attendanceGroup = app.MapGroup("/api/attendance");

        attendanceGroup.MapGet("/{className}", async (string className, AppDbContext db) =>
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

        attendanceGroup.MapPost("", async (AttendanceRequest request, AppDbContext db, IAuditService audit) =>
        {
            var student = await db.Students.FindAsync(request.StudentId);
            if (student is null)
            {
                return Results.BadRequest(new { message = "Student not found." });
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

            return Results.Created($"/api/attendance/{attendance.Id}", new
            {
                attendance.Id,
                attendance.StudentId,
                StudentName = student.FirstName + " " + student.LastName,
                student.ClassName,
                attendance.Date,
                attendance.Status,
                attendance.Notes
            });
        }).RequireAuthorization("StaffOnly")
        .WithName("CreateAttendance");

        return app;
    }
}
