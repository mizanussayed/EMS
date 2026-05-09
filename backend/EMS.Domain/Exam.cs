namespace EMS.Domain;

public class Exam
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Type { get; set; } = "Monthly";
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string? ClassName { get; set; }
}
