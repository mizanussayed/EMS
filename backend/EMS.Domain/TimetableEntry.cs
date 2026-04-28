namespace EMS.Domain;

public class TimetableEntry
{
    public int Id { get; set; }
    public string ClassName { get; set; } = default!;
    public string SubjectName { get; set; } = default!;
    public string TeacherName { get; set; } = default!;
    public string DayOfWeek { get; set; } = default!;
    public string StartTime { get; set; } = default!;
    public string EndTime { get; set; } = default!;
    public string Room { get; set; } = default!;
}
