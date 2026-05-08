namespace EMS.Domain;

public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime EndDate { get; set; } = DateTime.UtcNow;
    public string Location { get; set; } = default!;
    public string Type { get; set; } = "General";
    public string OrganizedBy { get; set; } = default!;
    public bool IsActive { get; set; } = true;
}
