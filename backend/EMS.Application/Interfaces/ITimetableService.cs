using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface ITimetableService
{
    Task<IReadOnlyList<TimetableEntry>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TimetableEntry>> GetByClassAsync(string className, CancellationToken cancellationToken = default);
    Task<TimetableEntry> CreateAsync(TimetableEntry entry, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, TimetableEntry update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}