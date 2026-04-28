namespace EMS.Domain;

public class AppUser
{
    public int Id { get; set; }
    public string UserName { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string Role { get; set; } = "Parent";
    public List<RefreshToken> RefreshTokens { get; set; } = new();
}
