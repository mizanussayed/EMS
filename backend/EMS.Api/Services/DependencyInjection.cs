using EMS.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace EMS.Api.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();
        services.AddHttpContextAccessor();
        return services;
    }
}