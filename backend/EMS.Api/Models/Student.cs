namespace EMS.Api.Models;

public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? AdmissionNumber { get; set; }
    public string? ClassName { get; set; }
    public string? Section { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public bool Active { get; set; } = true;
}
