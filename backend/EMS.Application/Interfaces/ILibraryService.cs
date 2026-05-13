using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface ILibraryService
{
    Task<IReadOnlyList<Book>> GetBooksAsync(CancellationToken cancellationToken = default);
    Task<Book> AddBookAsync(Book book, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<BookIssue>> GetIssuedBooksAsync(CancellationToken cancellationToken = default);
    Task<BookIssue?> IssueBookAsync(BookIssue issue, CancellationToken cancellationToken = default);
    Task<BookIssue?> ReturnBookAsync(int id, CancellationToken cancellationToken = default);
}