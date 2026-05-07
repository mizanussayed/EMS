using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class LibraryEndpoints
{
    public static IEndpointRouteBuilder MapLibraryEndpoints(this IEndpointRouteBuilder app)
    {
        var libraryGroup = app.MapGroup("/api/library")
            .WithTags("Library")
            .RequireAuthorization("AdminOnly");

        // Books
        libraryGroup.MapGet("/books", async (ILibraryService libraryService) =>
            await libraryService.GetBooksAsync())
            .WithName("GetBooks");

        libraryGroup.MapPost("/books", async (Book book, ILibraryService libraryService) =>
        {
            var created = await libraryService.AddBookAsync(book);
            return Results.Created($"/api/library/books/{created.Id}", created);
        })
        .WithName("AddBook");

        libraryGroup.MapGet("/issues", async (ILibraryService libraryService) =>
            await libraryService.GetIssuedBooksAsync())
            .WithName("GetIssuedBooks");

        libraryGroup.MapPost("/issues", async (BookIssue issue, ILibraryService libraryService) =>
        {
            var created = await libraryService.IssueBookAsync(issue);
            return created is null ? Results.BadRequest(new { message = "Book not available." }) : Results.Created($"/api/library/issues/{created.Id}", created);
        })
        .WithName("IssueBook");

        libraryGroup.MapPut("/issues/{id:int}/return", async (int id, ILibraryService libraryService) =>
        {
            var issue = await libraryService.ReturnBookAsync(id);
            return issue is null ? Results.NotFound() : Results.Ok(issue);
        })
        .WithName("ReturnBook");

        return app;
    }
}
