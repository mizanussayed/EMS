using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class AuthEndpoints
{
    private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
    {
        "Admin",
        "Teacher",
        "Student",
        "Accountant"
    };

    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var authGroup = app.MapGroup("/api/auth").WithTags("Auth");

        authGroup.MapPost("/register", async (RegisterRequest request, IApplicationDbContext db, IPasswordHasher<AppUser> hasher, ITokenService tokens) =>
        {
            if (!AllowedRoles.Contains(request.Role))
            {
                return Results.BadRequest(new { message = "Invalid role." });
            }

            var existing = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserName == request.UserName);
            if (existing is not null)
            {
                return Results.Conflict(new { message = "Username already exists." });
            }

            var user = new AppUser
            {
                UserName = request.UserName,
                Role = request.Role
            };
            user.PasswordHash = hasher.HashPassword(user, request.Password);

            db.Users.Add(user);
            await db.SaveChangesAsync();

            var accessToken = tokens.CreateToken(user);
            var refreshToken = tokens.GenerateRefreshToken();
            refreshToken.UserId = user.Id;
            db.RefreshTokens.Add(refreshToken);
            await db.SaveChangesAsync();

            return Results.Ok(new AuthResponse(accessToken, user.Role, user.UserName, refreshToken.Token));
        }).WithName("Register");

        authGroup.MapPost("/login", async (LoginRequest credentials, IApplicationDbContext db, IPasswordHasher<AppUser> hasher, ITokenService tokens) =>
        {
            var user = await db.Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefaultAsync(u => u.UserName == credentials.UserName);

            if (user is null)
            {
                return Results.Unauthorized();
            }

            var verification = hasher.VerifyHashedPassword(user, user.PasswordHash, credentials.Password);
            if (verification == PasswordVerificationResult.Failed)
            {
                return Results.Unauthorized();
            }

            var accessToken = tokens.CreateToken(user);
            var refreshToken = tokens.GenerateRefreshToken();
            refreshToken.UserId = user.Id;
            db.RefreshTokens.Add(refreshToken);
            await db.SaveChangesAsync();

            return Results.Ok(new AuthResponse(accessToken, user.Role.ToUpper(), user.UserName, refreshToken.Token));
        }).WithName("Login");

        authGroup.MapPost("/refresh", async (RefreshRequest request, IApplicationDbContext db, ITokenService tokens) =>
        {
            var token = await db.RefreshTokens
                .Include(t => t.User)
                .SingleOrDefaultAsync(t => t.Token == request.RefreshToken);

            if (token is null || token.ExpiresAt <= DateTimeOffset.UtcNow)
            {
                return Results.Unauthorized();
            }

            db.RefreshTokens.Remove(token);
            var accessToken = tokens.CreateToken(token.User);
            var newRefreshToken = tokens.GenerateRefreshToken();
            newRefreshToken.UserId = token.UserId;
            db.RefreshTokens.Add(newRefreshToken);
            await db.SaveChangesAsync();

            return Results.Ok(new AuthResponse(accessToken, token.User.Role, token.User.UserName, newRefreshToken.Token));
        }).WithName("RefreshToken");

        return app;
    }
}
