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