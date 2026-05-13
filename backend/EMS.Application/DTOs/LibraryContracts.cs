namespace EMS.Application.DTOs;

public record BookIssueDto(
    int Id,
    int BookId,
    string BookTitle,
    int StudentId,
    string StudentName,
    DateTime IssueDate,
    DateTime DueDate,
    DateTime? ReturnDate,
    string Status);