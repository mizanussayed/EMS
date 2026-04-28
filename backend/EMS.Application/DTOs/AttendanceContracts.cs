namespace EMS.Application.DTOs;

public record AttendanceRequest(int StudentId, DateOnly Date, string Status, string? Notes);
