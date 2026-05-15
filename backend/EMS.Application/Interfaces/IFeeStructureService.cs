using EMS.Application.DTOs;
using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IFeeStructureService
{
    Task<List<FeeStructureDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<FeeStructureDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<FeeStructureDto> CreateAsync(CreateFeeStructureRequest request, CancellationToken cancellationToken = default);
    Task<FeeStructureDto?> UpdateAsync(int id, UpdateFeeStructureRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<List<FeeStructureDto>> GetByClassIdAsync(int classId, CancellationToken cancellationToken = default);
}
