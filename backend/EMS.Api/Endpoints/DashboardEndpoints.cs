using EMS.Api.Contracts;
using EMS.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/dashboard", async (AppDbContext db) =>
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var studentCount = await db.Students.AsNoTracking().CountAsync();
            var classCount = await db.Students.AsNoTracking()
                .Select(student => student.ClassName)
                .Distinct()
                .CountAsync();
            var attendanceToday = await db.Attendances.AsNoTracking()
                .Where(record => record.Date == today)
                .ToListAsync();

            var presentToday = attendanceToday.Count(record => record.Status == "Present");
            var absentToday = attendanceToday.Count(record => record.Status == "Absent");

            return Results.Ok(new DashboardSummary(
                studentCount,
                classCount,
                attendanceToday.Count,
                presentToday,
                absentToday,
                today));
        }).WithName("GetDashboardSummary");

        return app;
    }
}
