namespace EMS.Application.DTOs;

public record ExamResultDto(
    int Id,
    int ExamId,
    int StudentId,
    string StudentName,
    string? ClassName,
    string SubjectName,
    double MarksObtained,
    double TotalMarks,
    string Grade,
    string? Remarks);