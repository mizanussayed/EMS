namespace EMS.Domain;

public class Fee
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = default!;
    public string Month { get; set; } = default!;
    public double Amount { get; set; }
    public double PaidAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime? PaymentDate { get; set; }
    public string? PaymentMethod { get; set; }
}
