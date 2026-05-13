using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
            .WithTags("Dashboard")
            .RequireAuthorization("StaffOnly");


        group.MapGet("", async (IApplicationDbContext db) =>
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var studentCount = await db.Students.AsNoTracking().CountAsync();
            var classCount = await db.Students.AsNoTracking()
                .Select(student => student.ClassId)
                .Distinct()
                .CountAsync();
            var attendanceToday = await db.Attendances.AsNoTracking()
                .Where(record => record.Date == today)
                .ToListAsync();

            var presentToday = attendanceToday.Count(record => record.Status == "Present");
            var absentToday = attendanceToday.Count(record => record.Status == "Absent");

            var teacherCount = await db.Staff.AsNoTracking().CountAsync(s => s.Role == "Teacher");
            var totalFeesCollected = await db.Fees.AsNoTracking().SumAsync(f => f.PaidAmount);
            var totalFeesExpected = await db.Fees.AsNoTracking().SumAsync(f => f.Amount);

            return Results.Ok(new DashboardSummary(
                studentCount,
                classCount,
                attendanceToday.Count,
                presentToday,
                absentToday,
                teacherCount,
                totalFeesCollected,
                totalFeesExpected - totalFeesCollected,
                today));
        }).WithName("GetDashboardSummary");

        return app;
    }
}
