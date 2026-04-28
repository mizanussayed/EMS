namespace EMS.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(string action, string entityName, string? entityId, string? details);
}
