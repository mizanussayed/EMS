namespace EMS.Domain;

public class Shift
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string StartTime { get; set; } = default!;
    public string EndTime { get; set; } = default!;
    public string? TeacherLateTime { get; set; }
    public string? StudentLateTime { get; set; }
    public string? StaffLateTime { get; set; }
    public bool IsActive { get; set; } = true;
}
