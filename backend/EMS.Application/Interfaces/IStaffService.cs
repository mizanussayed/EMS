using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IStaffService
{
    Task<IReadOnlyList<Staff>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Staff?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Staff> CreateAsync(Staff member, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Staff update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}