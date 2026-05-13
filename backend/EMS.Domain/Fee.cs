namespace EMS.Domain;

public class Fee
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int ClassId { get; set; }
    public string Month { get; set; } = default!;
    public double Amount { get; set; }
    public double PaidAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public DateOnly PaymentDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public string? PaymentMethod { get; set; }
}
