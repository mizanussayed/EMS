using EMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class AuditEndpoints
{
    public static IEndpointRouteBuilder MapAuditEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/audit", async (IApplicationDbContext db) =>
            await db.AuditLogs.AsNoTracking()
                .OrderByDescending(a => a.Timestamp)
                .Take(200)
                .ToListAsync())
            .RequireAuthorization("AdminOnly")
            .WithName("GetAuditLogs");

        return app;
    }
}
