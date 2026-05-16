namespace EMS.Application.DTOs;

public record FeeDto(
    int Id,
    int StudentId,
    string StudentName,
    int ClassId,
    string Month,
    double Amount,
    double PaidAmount,
    string Status,
    DateTime? PaymentDate,
    string? PaymentMethod);

public record FeePaymentRequest(double Amount, string Method);

public record FeeStructureDto(
    int Id,
    int ClassId,
    string ClassName,
    string Month,
    double Amount,
    string? Description,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record CreateFeeStructureRequest(
    int ClassId,
    string Month,
    double Amount,
    string? Description);

public record UpdateFeeStructureRequest(
    string Month,
    double Amount,
    string? Description,
    bool IsActive);