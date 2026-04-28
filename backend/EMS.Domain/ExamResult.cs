namespace EMS.Domain;

public class ExamResult
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public Exam Exam { get; set; } = default!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public string SubjectName { get; set; } = default!;
    public double MarksObtained { get; set; }
    public double TotalMarks { get; set; }
    public string Grade { get; set; } = default!;
    public string? Remarks { get; set; }
}
