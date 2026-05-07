using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IEventService
{
    Task<IReadOnlyList<Event>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Event?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Event> CreateAsync(Event @event, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Event update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}