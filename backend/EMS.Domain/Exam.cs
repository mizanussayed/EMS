namespace EMS.Domain;

public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Type { get; set; } = "Monthly";
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Scheduled";
    public string? ClassName { get; set; }
}
