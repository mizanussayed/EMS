using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class SubjectEndpoints
{
    public static IEndpointRouteBuilder MapSubjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/subjects")
            .WithTags("Subject")
            .RequireAuthorization("AdminOnly");

        group.MapGet("", async (ISubjectService subjectService) =>
            await subjectService.GetAllAsync())
            .WithName("GetSubjects");

        group.MapGet("/{id:int}", async (int id, ISubjectService subjectService) =>
            await subjectService.GetByIdAsync(id) is SubjectDto subject ? Results.Ok(subject) : Results.NotFound())
            .WithName("GetSubjectById");

        group.MapPost("", async (Subject subject, ISubjectService subjectService) =>
        {
            var created = await subjectService.CreateAsync(subject);
            return Results.Created($"/api/subjects/{created.Id}", created);
        })
        .WithName("CreateSubject");

        group.MapPut("/{id:int}", async (int id, Subject update, ISubjectService subjectService) =>
            await subjectService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateSubject");

        group.MapDelete("/{id:int}", async (int id, ISubjectService subjectService) =>
            await subjectService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .WithName("DeleteSubject");

        return app;
    }
}
