using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class SubjectEndpoints
{
    public static IEndpointRouteBuilder MapSubjectEndpoints(this IEndpointRouteBuilder app)
    {
        var subjectGroup = app.MapGroup("/api/subjects")
            .WithTags("Subject")
            .RequireAuthorization("AdminOnly");

        subjectGroup.MapGet("", async (ISubjectService subjectService) =>
            await subjectService.GetAllAsync())
            .WithName("GetSubjects");

        subjectGroup.MapGet("/{id:int}", async (int id, ISubjectService subjectService) =>
            await subjectService.GetByIdAsync(id) is Subject subject ? Results.Ok(subject) : Results.NotFound())
            .WithName("GetSubjectById");

        subjectGroup.MapPost("", async (Subject subject, ISubjectService subjectService) =>
        {
            var created = await subjectService.CreateAsync(subject);
            return Results.Created($"/api/subjects/{created.Id}", created);
        })
        .WithName("CreateSubject");

        subjectGroup.MapPut("/{id:int}", async (int id, Subject update, ISubjectService subjectService) =>
            await subjectService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateSubject");

        subjectGroup.MapDelete("/{id:int}", async (int id, ISubjectService subjectService) =>
            await subjectService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .WithName("DeleteSubject");

        return app;
    }
}
