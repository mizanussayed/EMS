using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IClassService
{
    Task<IReadOnlyList<SchoolClass>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SchoolClass> CreateAsync(SchoolClass item, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, SchoolClass update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}