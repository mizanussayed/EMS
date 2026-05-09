namespace EMS.Application.DTOs;

public class StudentRequestModel
{
    public string ClassRollNo { get; set; } = string.Empty;
    public string AdmissionNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public int SectionId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Parent { get; set; } = string.Empty;
    public string ParentPhone { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public DateOnly AdmissionDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public string Address { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}