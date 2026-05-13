namespace EMS.Domain;

public class Staff
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Subject { get; set; }
    public string Email { get; set; } = default!;
    public string? Phone { get; set; }
    public string? Qualification { get; set; }
    public string? Experience { get; set; }
    public string? Classes { get; set; }
    public string Status { get; set; } = "Active";
    public string? Address { get; set; }
    public DateOnly DateOfJoining { get; set; }
    public string Role { get; set; } = "Teacher";
}
