namespace EMS.Domain;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string? Teacher { get; set; }
    public string? Classes { get; set; } // e.g. "Grade 10A, 10B"
    public int Credits { get; set; } = 3;
    public string Type { get; set; } = "Core"; // Core, Elective
}
