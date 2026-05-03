namespace EMS.Domain;

public class StudentBadge
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Color { get; set; } = default!;
    public bool IsActive { get; set; }
}
