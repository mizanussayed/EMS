using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace EMS.Application.Services;

public class AuditService(IApplicationDbContext db, IHttpContextAccessor httpContextAccessor) : IAuditService
{
    public async Task LogAsync(string action, string entityName, string? entityId, string? details)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var userName = user?.Identity?.Name;
        var role = user?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role)?.Value;

        db.AuditLogs.Add(new AuditLog
        {
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            UserName = userName,
            UserRole = role,
            Details = details,
            Timestamp = DateTimeOffset.UtcNow
        });

        await db.SaveChangesAsync();
    }
}
