namespace EMS.Api.Contracts;

public record DashboardSummary(
    int StudentCount,
    int ClassCount,
    int AttendanceCount,
    int PresentCount,
    int AbsentCount,
    DateOnly Date);
