using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class StudentService(IApplicationDbContext db, IAuditService audit) : IStudentService
{
    public async Task<IReadOnlyList<Student>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Students.AsNoTracking().OrderBy(s => s.ClassId).ThenBy(s => s.SectionId).ToListAsync(cancellationToken);
    }

    public async Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Students.FindAsync([id], cancellationToken);
    }

    public async Task<Student> CreateAsync(StudentRequestModel request, CancellationToken cancellationToken = default)
    {
        var student = new Student
        {
            ClassRollNo = request.ClassRollNo,
            AdmissionNumber = request.AdmissionNumber,
            Name = request.Name,
            ClassId = request.ClassId,
            SectionId = request.SectionId,
            Email = request.Email,
            Parent = request.Parent,
            ParentPhone = request.ParentPhone,
            DateOfBirth = request.DateOfBirth,
            AdmissionDate = request.AdmissionDate,
            Address = request.Address,
            Gender = request.Gender,
            IsActive = request.IsActive
        };

        db.Students.Add(student);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "Student", student.Id.ToString(), $"Student {student.Name} created.");
        return student;
    }

    public async Task<bool> UpdateAsync(int id, Student update, CancellationToken cancellationToken = default)
    {
        var existing = await db.Students.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }
            
        existing.ClassRollNo = update.ClassRollNo;
        existing.AdmissionNumber = update.AdmissionNumber;
        existing.Name = update.Name;
        existing.ClassId = update.ClassId;
        existing.SectionId = update.SectionId;
        existing.Email = update.Email;
        existing.Parent = update.Parent;
        existing.ParentPhone = update.ParentPhone;
        existing.DateOfBirth = update.DateOfBirth;
        existing.AdmissionDate = update.AdmissionDate;
        existing.Address = update.Address;
        existing.Gender = update.Gender;
        existing.IsActive = update.IsActive;

        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "Student", existing.Id.ToString(), $"Student {existing.Name} updated.");
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
        await audit.LogAsync("DELETE", "Student", existing.Id.ToString(), $"Student {existing.Name} deleted.");
        return true;
    }
}