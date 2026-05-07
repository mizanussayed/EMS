using EMS.Application.DTOs;
using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IFeeService
{
    Task<IReadOnlyList<FeeDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Fee> CreateAsync(Fee fee, CancellationToken cancellationToken = default);
    Task<FeeDto?> ProcessPaymentAsync(int id, FeePaymentRequest request, CancellationToken cancellationToken = default);
}