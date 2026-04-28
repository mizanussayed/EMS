namespace EMS.Domain;

public class SchoolClass
{
    public int Id { get; set; }
    public string Name { get; set; } = default!; // e.g. Grade 10
    public string Section { get; set; } = default!; // e.g. A
    public string? ClassTeacher { get; set; }
    public string? Room { get; set; }
    public string? Schedule { get; set; } // Morning Shift, Afternoon Shift
}
