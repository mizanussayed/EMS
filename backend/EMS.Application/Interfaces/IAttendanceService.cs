using EMS.Application.DTOs;

namespace EMS.Application.Interfaces;

public interface IAttendanceService
{
    Task<IReadOnlyList<AttendanceDto>> GetAttendanceByClassAsync(int ClassId, CancellationToken cancellationToken = default);
    Task<AttendanceUpsertResult> CreateOrUpdateAsync(AttendanceRequest request, CancellationToken cancellationToken = default);
}