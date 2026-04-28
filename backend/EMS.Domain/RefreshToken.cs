namespace EMS.Domain;

public class RefreshToken
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public AppUser User { get; set; } = default!;
    public string Token { get; set; } = default!;
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
