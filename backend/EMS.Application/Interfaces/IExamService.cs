using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface IExamService
{
    Task<IReadOnlyList<Exam>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Exam> CreateAsync(Exam exam, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(int id, Exam update, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExamResult>> GetResultsAsync(int examId, CancellationToken cancellationToken = default);
    Task<ExamResult> AddResultAsync(int examId, ExamResult result, CancellationToken cancellationToken = default);
}