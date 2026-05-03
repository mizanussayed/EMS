using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Api.Endpoints;

public static class ExamEndpoints
{
    public static IEndpointRouteBuilder MapExamEndpoints(this IEndpointRouteBuilder app)
    {
        var examGroup = app.MapGroup("/api/exams")
            .WithTags("Exams")
            .RequireAuthorization("StaffOnly");

        examGroup.MapGet("", async (IApplicationDbContext db) =>
            await db.Exams.AsNoTracking().OrderByDescending(e => e.StartDate).ToListAsync())
            .WithName("GetExams");

        examGroup.MapPost("", async (Exam exam, IApplicationDbContext db, IAuditService audit) =>
        {
            db.Exams.Add(exam);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "Exam", exam.Id.ToString(), $"Exam {exam.Title} scheduled.");
            return Results.Created($"/api/exams/{exam.Id}", exam);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("CreateExam");

        examGroup.MapGet("/{examId:int}/results", async (int examId, IApplicationDbContext db) =>
            await db.ExamResults
                .Include(r => r.Student)
                .Where(r => r.ExamId == examId)
                .Select(r => new
                {
                    r.Id,
                    r.StudentId,
                    StudentName = r.Student.FirstName + " " + r.Student.LastName,
                    r.SubjectName,
                    r.MarksObtained,
                    r.TotalMarks,
                    r.Grade,
                    r.Remarks
                })
                .ToListAsync())
            .WithName("GetExamResults");

        examGroup.MapPost("/{examId:int}/results", async (int examId, ExamResult result, IApplicationDbContext db, IAuditService audit) =>
        {
            result.ExamId = examId;
            db.ExamResults.Add(result);
            await db.SaveChangesAsync();
            await audit.LogAsync("CREATE", "ExamResult", result.Id.ToString(), $"Result recorded for student ID {result.StudentId}.");
            return Results.Ok(result);
        })
        .RequireAuthorization("AdminOnly")
        .WithName("AddExamResult");

        return app;
    }
}
