namespace EMS.Domain;

public class BookIssue
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; } = default!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public DateTime IssueDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public string Status { get; set; } = "Issued"; // Issued, Returned, Overdue
}
