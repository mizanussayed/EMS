namespace EMS.Application.DTOs;

public record DashboardSummary(
    int StudentCount,
    int ClassCount,
    int AttendanceCount,
    int PresentCount,
    int AbsentCount,
    int TeacherCount,
    double TotalFeesCollected,
    double TotalFeesPending,
    DateOnly Date);
