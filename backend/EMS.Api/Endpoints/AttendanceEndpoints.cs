using EMS.Application.DTOs;
using EMS.Application.Interfaces;

namespace EMS.Api.Endpoints;

public static class AttendanceEndpoints
{
    public static IEndpointRouteBuilder MapAttendanceEndpoints(this IEndpointRouteBuilder app)
    {
        var attendanceGroup = app.MapGroup("/api/attendance").WithTags("Attendance");

        attendanceGroup.MapGet("/{ClassId:int}", async (int ClassId, IAttendanceService attendanceService) =>
            Results.Ok(await attendanceService.GetAttendanceByClassAsync(ClassId)))
            .WithName("GetAttendanceByClass");

        attendanceGroup.MapPost("", async (AttendanceRequest request, IAttendanceService attendanceService) =>
        {
            var result = await attendanceService.CreateOrUpdateAsync(request);

            if (result.Status == AttendanceUpsertStatus.StudentNotFound)
            {
                return Results.BadRequest(new { message = result.ErrorMessage ?? "Student not found." });
            }

            if (result.Status == AttendanceUpsertStatus.Updated)
            {
                return Results.Ok(result.Attendance);
            }

            return Results.Created($"/api/attendance/{result.Attendance?.Id}", result.Attendance);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateOrUpdateAttendance");

        return app;
    }
}
