using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IShiftService
{
    Task<IReadOnlyList<Shift>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Shift> CreateAsync(Shift item, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Shift update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}