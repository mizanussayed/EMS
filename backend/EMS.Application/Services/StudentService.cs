using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class StudentService(IApplicationDbContext db, IAuditService audit) : IStudentService
{
    public async Task<IReadOnlyList<Student>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Students.AsNoTracking().OrderBy(s => s.LastName).ToListAsync(cancellationToken);
    }

    public async Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Students.FindAsync([id], cancellationToken);
    }

    public async Task<Student> CreateAsync(StudentRequestModel request, CancellationToken cancellationToken = default)
    {
        var student = new Student
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            AdmissionNumber = request.AdmissionNumber,
            ClassName = request.ClassName,
            Section = request.Section,
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth
        };

        db.Students.Add(student);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Student", student.Id.ToString(), $"Student {student.FirstName} {student.LastName} created.");
        return student;
    }

    public async Task<bool> UpdateAsync(int id, Student update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Students.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        existing.FirstName = update.FirstName;
        existing.LastName = update.LastName;
        existing.AdmissionNumber = update.AdmissionNumber;
        existing.ClassName = update.ClassName;
        existing.Section = update.Section;
        existing.DateOfBirth = update.DateOfBirth;
        existing.Gender = update.Gender;
        existing.Active = update.Active;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Student", existing.Id.ToString(), $"Student {existing.FirstName} {existing.LastName} updated.");
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await db.Students.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        db.Students.Remove(existing);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "Student", existing.Id.ToString(), $"Student {existing.FirstName} {existing.LastName} deleted.");
        return true;
    }
}