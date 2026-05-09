using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class LibraryService(IApplicationDbContext db, IAuditService audit) : ILibraryService
{
    public async Task<IReadOnlyList<Book>> GetBooksAsync(CancellationToken cancellationToken = default)
    {
        return await db.Books.AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<Book> AddBookAsync(Book book, CancellationToken cancellationToken = default)
    {
        db.Books.Add(book);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Book", book.Id.ToString(), $"Book {book.Title} added to library.");
        return book;
    }

    public async Task<IReadOnlyList<BookIssue>> GetIssuedBooksAsync(CancellationToken cancellationToken = default)
    {
        return await db.BookIssues
            .AsNoTracking()
            .Include(i => i.Book)
            .Include(i => i.Student)
            .ToListAsync(cancellationToken);
    }

    public async Task<BookIssue?> IssueBookAsync(BookIssue issue, CancellationToken cancellationToken = default)
    {
        var book = await db.Books.FindAsync([issue.BookId], cancellationToken);
        if (book is null || book.AvailableQuantity <= 0)
        {
            return null;
        }

        book.AvailableQuantity--;
        db.BookIssues.Add(issue);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "BookIssue", issue.Id.ToString(), $"Book {book.Title} issued to student ID {issue.StudentId}.");
        return issue;
    }

    public async Task<BookIssue?> ReturnBookAsync(int id, CancellationToken cancellationToken = default)
    {
        var issue = await db.BookIssues.Include(i => i.Book).FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (issue is null)
        {
            return null;
        }

        issue.ReturnDate = DateOnly.FromDateTime(DateTime.UtcNow);
        issue.Status = "Returned";
        issue.Book.AvailableQuantity++;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "BookIssue", id.ToString(), $"Book {issue.Book.Title} returned.");
        return issue;
    }
}