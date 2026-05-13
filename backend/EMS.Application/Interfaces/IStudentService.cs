using EMS.Application.DTOs;
using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IStudentService
{
    Task<IReadOnlyList<StudentResponseModel>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<StudentResponseModel?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<StudentResponseModel?> CreateAsync(StudentRequestModel request, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, StudentRequestModel update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}