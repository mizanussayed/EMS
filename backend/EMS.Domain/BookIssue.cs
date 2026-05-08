namespace EMS.Domain;

public class BookIssue
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; } = default!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; } = DateTime.UtcNow;
    public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Issued"; // Issued, Returned, Overdue
}
