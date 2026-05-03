namespace EMS.Domain;

public class SchoolClass
{
    public int Id { get; set; }
    public string Name { get; set; } = default!; // e.g. Grade 10
    public string Section { get; set; } = default!; // e.g. A
    public int ClassTeacherId { get; set; }
    public string? Room { get; set; }
    public int ShiftId { get; set; }
    public int NumberOfSubjects { get; set; }
    public int NumberOfStudents { get; set; }
}
