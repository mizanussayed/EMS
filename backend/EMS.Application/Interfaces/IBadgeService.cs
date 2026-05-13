using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IBadgeService
{
    Task<IReadOnlyList<StudentBadge>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<StudentBadge> CreateAsync(StudentBadge item, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, StudentBadge update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}