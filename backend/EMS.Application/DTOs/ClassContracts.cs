namespace EMS.Application.DTOs;

public record SchoolClassDto(
    int Id,
    string Name,
    string Section,
    int ClassTeacherId,
    string? Room,
    int ShiftId,
    int NumberOfSubjects,
    int NumberOfStudents);