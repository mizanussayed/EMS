using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class StudentService(IApplicationDbContext db, IAuditService audit) : IStudentService
{
    public async Task<IReadOnlyList<StudentResponseModel>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Students
                .AsNoTracking()
                .OrderBy(s => s.ClassId)
                .ThenBy(s => s.SectionId)
                .LeftJoin(db.Classes, s => s.ClassId, c => c.Id, (s, c) => new { Student = s, Class = c })
                .Select(s => new StudentResponseModel
                {
                    Id = s.Student.Id,
                    ClassRollNo = s.Student.ClassRollNo,
                    AdmissionNumber = s.Student.AdmissionNumber,
                    Name = s.Student.Name,
                    ClassId = s.Student.ClassId,
                    SectionId = s.Student.SectionId,
                    Email = s.Student.Email,
                    Parent = s.Student.Parent,
                    ParentPhone = s.Student.ParentPhone,
                    DateOfBirth = s.Student.DateOfBirth,
                    AdmissionDate = s.Student.AdmissionDate,
                    Address = s.Student.Address,
                    IsActive = s.Student.IsActive,
                    ClassName = s.Class!.Name,
                    SectionName = s.Student.SectionId == 1 ? "A" : "B",
                    Gender = s.Student.Gender
                })
                .ToListAsync(cancellationToken);
    }

    public async Task<StudentResponseModel?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await db.Students
            .AsNoTracking()
            .Where(s => s.Id == id)
            .LeftJoin(db.Classes, s => s.ClassId, c => c.Id, (s, c) => new { Student = s, Class = c })
            .Select(joined => new StudentResponseModel
            {
                Id = joined.Student.Id,
                ClassRollNo = joined.Student.ClassRollNo,
                AdmissionNumber = joined.Student.AdmissionNumber,
                Name = joined.Student.Name,
                ClassId = joined.Student.ClassId,
                SectionId = joined.Student.SectionId,
                Email = joined.Student.Email,
                Parent = joined.Student.Parent,
                ParentPhone = joined.Student.ParentPhone,
                DateOfBirth = joined.Student.DateOfBirth,
                AdmissionDate = joined.Student.AdmissionDate,
                Address = joined.Student.Address,
                IsActive = joined.Student.IsActive,
                ClassName = joined.Class!.Name,
                Gender = joined.Student.Gender
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<StudentResponseModel?> CreateAsync(StudentRequestModel request, CancellationToken cancellationToken = default)
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
        return await GetByIdAsync(student.Id, cancellationToken);
    }

    public async Task<bool> UpdateAsync(int id, StudentRequestModel update, CancellationToken cancellationToken = default)
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