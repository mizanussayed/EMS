namespace EMS.Api.Models;

public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; } = default!;
    public string EntityName { get; set; } = default!;
    public string? EntityId { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
    public string? Details { get; set; }
    public DateTimeOffset Timestamp { get; set; }
}
