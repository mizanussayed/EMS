namespace EMS.Application.DTOs;

public record SubjectDto(
    int Id,
    string Name,
    string Code,
    int TeacherId,
    int ClassId,
    int FullMarks,
    string Type,
    string TeacherName,
    string ClassName
);

