using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class EventService(IApplicationDbContext db, IAuditService audit) : IEventService
{
    public async Task<IReadOnlyList<Event>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Placeholder for future changes after date-only model conversion
        return await db.Events.AsNoTracking().OrderBy(e => e.StartDate).ToListAsync(cancellationToken);
    }

    public async Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Events.FindAsync([id], cancellationToken);
    }

    public async Task<Event> CreateAsync(Event @event, CancellationToken cancellationToken = default)
    {
        db.Events.Add(@event);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Event", @event.Id.ToString(), $"Event {@event.Title} created.");
        return @event;
    }

    public async Task<bool> UpdateAsync(int id, Event update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Events.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.Title = update.Title;
        existing.Description = update.Description;
        existing.StartDate = update.StartDate;
        existing.EndDate = update.EndDate;
        existing.Location = update.Location;
        existing.OrganizedBy = update.OrganizedBy;
        existing.IsActive = update.IsActive;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Event", existing.Id.ToString(), $"Event {existing.Title} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Events.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Events.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Event", id.ToString(), "Event deleted.");
        return true;
    }
}