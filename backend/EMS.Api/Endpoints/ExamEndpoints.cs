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

        examGroup.MapPut("/{id:int}", async (int id, Exam update, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Exams.FindAsync(id);
            if (existing is null)
                return Results.NotFound();

            existing.Title = update.Title;
            existing.Type = update.Type;
            existing.StartDate = update.StartDate;
            existing.EndDate = update.EndDate;
            existing.Status = update.Status;
            existing.ClassName = update.ClassName;

            await db.SaveChangesAsync();
            await audit.LogAsync("UPDATE", "Exam", existing.Id.ToString(), $"Exam {existing.Title} updated.");
            return Results.NoContent();
        })
        .RequireAuthorization("AdminOnly")
        .WithName("UpdateExam");

        examGroup.MapGet("/{examId:int}/results", async (int examId, IApplicationDbContext db) =>
            await db.ExamResults
                .Include(r => r.Student)
                .Where(r => r.ExamId == examId)
                .Select(r => new
                {
                    r.Id,
                    r.ExamId,
                    r.StudentId,
                    StudentName = r.Student.FirstName + " " + r.Student.LastName,
                    ClassName = r.Student.ClassName,
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

        examGroup.MapDelete("/{id:int}", async (int id, IApplicationDbContext db, IAuditService audit) =>
        {
            var existing = await db.Exams.FindAsync(id);
            if (existing is null)
                return Results.NotFound();

            db.Exams.Remove(existing);
            await db.SaveChangesAsync();
            await audit.LogAsync("DELETE", "Exam", existing.Id.ToString(), $"Exam {existing.Title} deleted.");
            return Results.NoContent();
        })
        .RequireAuthorization("AdminOnly")
        .WithName("DeleteExam");

        return app;
    }
}
