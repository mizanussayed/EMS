namespace EMS.Application.DTOs;

public record AttendanceDto(
    int Id,
    int StudentId,
    string StudentName,
    int? ClassId,
    DateOnly Date,
    string Status,
    string? Notes);

public enum AttendanceUpsertStatus
{
    StudentNotFound,
    Created,
    Updated
}

public record AttendanceUpsertResult(AttendanceUpsertStatus Status, AttendanceDto? Attendance, string? ErrorMessage);