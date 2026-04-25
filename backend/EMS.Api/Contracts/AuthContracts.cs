namespace EMS.Api.Contracts;

public record RegisterRequest(string UserName, string Password, string Role);
public record LoginRequest(string UserName, string Password);
public record RefreshRequest(string RefreshToken);
public record AuthResponse(string AccessToken, string Role, string UserName, string? RefreshToken);
