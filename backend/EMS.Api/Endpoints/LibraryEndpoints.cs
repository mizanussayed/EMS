using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class LibraryEndpoints
{
    public static IEndpointRouteBuilder MapLibraryEndpoints(this IEndpointRouteBuilder app)
    {
        var libraryGroup = app.MapGroup("/api/library")
            .WithTags("Library")
            .RequireAuthorization("AdminOnly");

        // Books
        libraryGroup.MapGet("/books", async (IApplicationDbContext db) =>
            await db.Books.AsNoTracking().ToListAsync())
            .WithName("GetBooks");

        libraryGroup.MapPost("/books", async (Book book, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Books.Add(book);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Book", book.Id.ToString(), $"Book {book.Title} added to library.");
            return Results.Created($"/api/library/books/{book.Id}", book);
        })
        .WithName("AddBook");

        // Book Issues
        libraryGroup.MapGet("/issues", async (IApplicationDbContext db) =>
            await db.BookIssues
                .AsNoTracking()
                .Include(i => i.Book)
                .Include(i => i.Student)
                .Select(i => new
                {
                    i.Id,
                    i.BookId,
                    BookTitle = i.Book.Title,
                    i.StudentId,
                    StudentName = i.Student.FirstName + " " + i.Student.LastName,
                    i.IssueDate,
                    i.DueDate,
                    i.ReturnDate,
                    i.Status
                })
                .ToListAsync())
            .WithName("GetIssuedBooks");

        libraryGroup.MapPost("/issues", async (BookIssue issue, IApplicationDbContext db, IAuditService audit) =>
        {
            var book = await db.Books.FindAsync(issue.BookId);
            if (book == null || book.AvailableQuantity <= 0)
                return Results.BadRequest(new { message = "Book not available." });

            book.AvailableQuantity--;
            db.BookIssues.Add(issue);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "BookIssue", issue.Id.ToString(), $"Book {book.Title} issued to student ID {issue.StudentId}.");
            return Results.Created($"/api/library/issues/{issue.Id}", issue);
        })
        .WithName("IssueBook");

        libraryGroup.MapPut("/issues/{id:int}/return", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var issue = await db.BookIssues.Include(i => i.Book).FirstOrDefaultAsync(i => i.Id == id);
            if (issue == null) return Results.NotFound();

            issue.ReturnDate = DateTime.UtcNow;
            issue.Status = "Returned";
            issue.Book.AvailableQuantity++;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "BookIssue", id.ToString(), $"Book {issue.Book.Title} returned.");
            return Results.Ok(issue);
        })
        .WithName("ReturnBook");

        return app;
    }
}
