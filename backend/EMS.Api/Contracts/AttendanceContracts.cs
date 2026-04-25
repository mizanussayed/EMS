namespace EMS.Api.Contracts;

public record AttendanceRequest(int StudentId, DateOnly Date, string Status, string? Notes);
