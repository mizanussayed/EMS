using EMS.Application.Interfaces;
using EMS.Domain;

namespace EMS.Api.Endpoints;

public static class ExamEndpoints
{
    public static IEndpointRouteBuilder MapExamEndpoints(this IEndpointRouteBuilder app)
    {
        var examGroup = app.MapGroup("/api/exams")
            .WithTags("Exams")
            .RequireAuthorization("StaffOnly");

        examGroup.MapGet("", async (IExamService examService) =>
            await examService.GetAllAsync())
            .WithName("GetExams");

        examGroup.MapPost("", async (Exam exam, IExamService examService) =>
        {
            var created = await examService.CreateAsync(exam);
            return Results.Created($"/api/exams/{created.Id}", created);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateExam");

        examGroup.MapPut("/{id:int}", async (int id, Exam update, IExamService examService) =>
            await examService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("UpdateExam");

        examGroup.MapGet("/{examId:int}/results", async (int examId, IExamService examService) =>
            await examService.GetResultsAsync(examId))
            .WithName("GetExamResults");

        examGroup.MapPost("/{examId:int}/results", async (int examId, ExamResult result, IExamService examService) =>
            Results.Ok(await examService.AddResultAsync(examId, result)))
        .RequireAuthorization("AdminOnly")
        .WithName("AddExamResult");

        examGroup.MapDelete("/{id:int}", async (int id, IExamService examService) =>
            await examService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .RequireAuthorization("AdminOnly")
        .WithName("DeleteExam");

        return app;
    }
}
