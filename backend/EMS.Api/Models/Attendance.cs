namespace EMS.Api.Models;

public class Attendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public DateOnly Date { get; set; }
    public string Status { get; set; } = "Present";
    public string? Notes { get; set; }
}
