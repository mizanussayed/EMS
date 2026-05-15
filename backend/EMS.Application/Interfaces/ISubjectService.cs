using EMS.Application.DTOs;
using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface ISubjectService
{
    Task<IReadOnlyList<SubjectDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<SubjectDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<SubjectDto> CreateAsync(Subject subject, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Subject update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}