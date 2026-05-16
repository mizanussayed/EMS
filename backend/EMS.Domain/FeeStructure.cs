namespace EMS.Domain;

public class FeeStructure
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public string Month { get; set; } = default!;
    public double Amount { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
