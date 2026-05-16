namespace EMS.Domain;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public int TeacherId { get; set; }
    public int ClassId { get; set; }
    public int FullMarks { get; set; } = 100;
    public string Type { get; set; } = "Core"; // Core, Elective
}
