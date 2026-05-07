using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.AspNetCore.Authorization;

namespace EMS.Api.Endpoints;

public static class StudentEndpoints
{
    public static IEndpointRouteBuilder MapStudentEndpoints(this IEndpointRouteBuilder app)
    {
        var studentGroup = app.MapGroup("/api/students")
            .WithTags("Student")
            .RequireAuthorization("StaffOnly");

        studentGroup.MapGet("", async (IStudentService studentService) =>
            await studentService.GetAllAsync())
            .WithName("GetStudents");

        studentGroup.MapGet("/{id:int}", async (int id, IStudentService studentService) =>
            await studentService.GetByIdAsync(id) is Student student ? Results.Ok(student) : Results.NotFound())
            .WithName("GetStudentById")
            .AllowAnonymous();

        studentGroup.MapPost("", [Authorize("AdminOnly")] async (StudentRequestModel request, IStudentService studentService) =>
        {
            var student = await studentService.CreateAsync(request);
            return Results.Created($"/api/students/{student.Id}", student);
        })
        .WithName("CreateStudent");

        studentGroup.MapPut("/{id:int}", async (int id, Student update, IStudentService studentService) =>
            await studentService.UpdateAsync(id, update) ? Results.NoContent() : Results.NotFound())
        .WithName("UpdateStudent");

        studentGroup.MapDelete("/{id:int}", async (int id, IStudentService studentService) =>
            await studentService.DeleteAsync(id) ? Results.NoContent() : Results.NotFound())
        .WithName("DeleteStudent");

        return app;
    }
}
