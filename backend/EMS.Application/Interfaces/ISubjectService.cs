using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface ISubjectService
{
    Task<IReadOnlyList<Subject>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Subject?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Subject> CreateAsync(Subject subject, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Subject update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}