using EMS.Application.DTOs;
using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IStudentService
{
    Task<IReadOnlyList<Student>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Student> CreateAsync(StudentRequestModel request, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Student update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}