using EMS.Api.Data;
using EMS.Api.Models;
using System.Security.Claims;

namespace EMS.Api.Services;

public interface IAuditService
{
    Task LogAsync(string action, string entityName, string? entityId, string? details);
}

public class AuditService : IAuditService
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(AppDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(string action, string entityName, string? entityId, string? details)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        var userName = user?.Identity?.Name;
        var role = user?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role)?.Value;

        _db.AuditLogs.Add(new AuditLog
        {
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            UserName = userName,
            UserRole = role,
            Details = details,
            Timestamp = DateTimeOffset.UtcNow
        });

        await _db.SaveChangesAsync();
    }
}
