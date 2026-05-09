using EMS.Domain;
using EMS.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace EMS.Infrastructure;

public class DatabaseSeeder(AppDbContext dbContext, IPasswordHasher<AppUser> passwordHasher) : IDatabaseSeeder
{
    public void Seed()
    {
        dbContext.Database.EnsureCreated();

        if (!dbContext.Classes.Any())
        {
            dbContext.Classes.AddRange(
                new SchoolClass { Name = "Grade 1", Section = "A", Room = "Room 101", ShiftId = 1, ClassTeacherId = 1, NumberOfSubjects = 8, NumberOfStudents = 30 },
                new SchoolClass { Name = "Grade 1", Section = "B", Room = "Room 102", ShiftId = 1, ClassTeacherId = 2, NumberOfSubjects = 8, NumberOfStudents = 28 },
                new SchoolClass { Name = "Grade 2", Section = "A", Room = "Room 201", ShiftId = 2, ClassTeacherId = 3, NumberOfSubjects = 8, NumberOfStudents = 32 }
            );
            dbContext.SaveChanges();
        }

        if (!dbContext.Subjects.Any())
        {
            dbContext.Subjects.AddRange(
                new Subject { Name = "Mathematics", Code = "MATH-10", Teacher = "Dr. Robert Williams", Classes = "Grade 1, Grade 2", Credits = 4, Type = "Core" },
                new Subject { Name = "English Literature", Code = "ENG-10", Teacher = "Ms. Jennifer Clark", Classes = "Grade 1", Credits = 3, Type = "Core" },
                new Subject { Name = "Physics", Code = "PHY-10", Teacher = "Mr. David Martinez", Classes = "Grade 2", Credits = 4, Type = "Core" }
            );
            dbContext.SaveChanges();
        }

        if (!dbContext.Staff.Any())
        {
            dbContext.Staff.AddRange(
                new Staff { Name = "Dr. Robert Williams", Subject = "Mathematics", Email = "r.williams@school.edu", Phone = "+1 555-1001", Qualification = "PhD in Mathematics", Experience = "15 years", Classes = "Grade 1, Grade 2", Status = "Active", DateOfJoining = DateOnly.FromDateTime(UtcDate(2010, 8, 15)), Role = "Teacher" },
                new Staff { Name = "Ms. Jennifer Clark", Subject = "English Literature", Email = "j.clark@school.edu", Phone = "+1 555-1002", Qualification = "MA in English", Experience = "10 years", Classes = "Grade 1", Status = "Active", DateOfJoining = DateOnly.FromDateTime(UtcDate(2015, 7, 20)), Role = "Teacher" }
            );
            dbContext.SaveChanges();
        }

        if (!dbContext.Students.Any())
        {
            dbContext.Students.AddRange(
                new Student
                {
                    ClassRollNo = "1",
                    AdmissionNumber = "S1001",
                    ClassId = 1,
                    SectionId = 1,
                    Name = "Ayesha",
                    Gender = "Female",
                    DateOfBirth = DateOnly.FromDateTime(UtcDate(2017, 8, 15)),
                    AdmissionDate = DateOnly.FromDateTime(UtcDate(2023, 6, 1)),
                    Address = "123 Main Street, Cityville",
                    Parent = "Mr. and Mrs. Khan",
                    ParentPhone = "+1 555-1003",
                    IsActive = true
                },
                new Student
                {
                    ClassRollNo = "2",
                    AdmissionNumber = "S1002",
                    ClassId = 1,
                    SectionId = 1,
                    Name = "Rahul",
                    Gender = "Male",
                    DateOfBirth = DateOnly.FromDateTime(UtcDate(2017, 9, 3)),
                    AdmissionDate = DateOnly.FromDateTime(UtcDate(2023, 6, 1)),
                    Address = "456 Elm Street, Cityville",
                    Parent = "Mr. and Mrs. Sharma",
                    ParentPhone = "+1 555-1004",
                    IsActive = true
                });
            dbContext.SaveChanges();
        }

        if (!dbContext.Users.Any())
        {
            var admin = new AppUser
            {
                UserName = "admin",
                Role = "Admin"
            };
            admin.PasswordHash = passwordHasher.HashPassword(admin, "Password123");
            dbContext.Users.Add(admin);
            dbContext.SaveChanges();
        }

        if (!dbContext.Exams.Any())
        {
            dbContext.Exams.AddRange(
                new Exam { Title = "Mid-term Examination 2025", Type = "Mid-term", StartDate = DateOnly.FromDateTime(UtcDate(2025, 12, 1)), EndDate = DateOnly.FromDateTime(UtcDate(2025, 12, 15)), Status = "Scheduled" },
                new Exam { Title = "Unit Test - I", Type = "Unit Test", StartDate = DateOnly.FromDateTime(UtcDate(2025, 11, 20)), EndDate = DateOnly.FromDateTime(UtcDate(2025, 11, 25)), Status = "Completed" }
            );
            dbContext.SaveChanges();

            var exam = dbContext.Exams.First(e => e.Status == "Completed");
            var student = dbContext.Students.First();
            if (!dbContext.ExamResults.Any())
            {
                dbContext.ExamResults.AddRange(
                    new ExamResult { ExamId = exam.Id, StudentId = student.Id, SubjectName = "Mathematics", MarksObtained = 85, TotalMarks = 100, Grade = "A", Remarks = "Excellent performance" },
                    new ExamResult { ExamId = exam.Id, StudentId = student.Id, SubjectName = "Physics", MarksObtained = 78, TotalMarks = 100, Grade = "B+", Remarks = "Good, but can improve" }
                );
                dbContext.SaveChanges();
            }
        }

        if (!dbContext.TimetableEntries.Any())
        {
            dbContext.TimetableEntries.AddRange(
                new TimetableEntry { ClassName = "Grade 1", SubjectName = "Mathematics", TeacherName = "Dr. Robert Williams", DayOfWeek = "Monday", StartTime = "08:00", EndTime = "09:00", Room = "Room 101" },
                new TimetableEntry { ClassName = "Grade 1", SubjectName = "English Literature", TeacherName = "Ms. Jennifer Clark", DayOfWeek = "Tuesday", StartTime = "09:00", EndTime = "10:00", Room = "Room 102" },
                new TimetableEntry { ClassName = "Grade 2", SubjectName = "Physics", TeacherName = "Mr. David Martinez", DayOfWeek = "Monday", StartTime = "08:00", EndTime = "09:00", Room = "Room 201" }
            );
            dbContext.SaveChanges();
        }

        if (!dbContext.Fees.Any())
        {
            var student1 = dbContext.Students.First();
            dbContext.Fees.AddRange(
                new Fee { StudentId = student1.Id, Month = "November 2025", Amount = 5000, PaidAmount = 5000, Status = "Paid", PaymentDate = DateOnly.FromDateTime(DateTime.UtcNow), PaymentMethod = "Cash" },
                new Fee { StudentId = student1.Id, Month = "December 2025", Amount = 5000, PaidAmount = 0, Status = "Pending" }
            );
            dbContext.SaveChanges();
        }

        if (!dbContext.Books.Any())
        {
            dbContext.Books.AddRange(
                new Book { Title = "Advanced Calculus", Author = "Isaac Newton", ISBN = "978-0123456789", Category = "Mathematics", Quantity = 10, AvailableQuantity = 9, RackNumber = "M-01" },
                new Book { Title = "Quantum Physics", Author = "Richard Feynman", ISBN = "978-0987654321", Category = "Science", Quantity = 5, AvailableQuantity = 5, RackNumber = "S-05" }
            );
            dbContext.SaveChanges();

            if (!dbContext.BookIssues.Any())
            {
                var book = dbContext.Books.First();
                var student = dbContext.Students.First();
                dbContext.BookIssues.Add(new BookIssue
                {
                    BookId = book.Id,
                    StudentId = student.Id,
                    IssueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-5)),
                    DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(9)),
                    Status = "Issued"
                });
                dbContext.SaveChanges();
            }
        }

        if (!dbContext.Events.Any())
        {
            dbContext.Events.AddRange(
                new Event { Title = "Annual Sports Day", Description = "Inter-house sports competitions", StartDate = DateTime.UtcNow.AddDays(15), EndDate = DateTime.UtcNow.AddDays(15).AddHours(8), Location = "Main Sports Ground", Type = "Sports", OrganizedBy = "", IsActive = true },
                new Event { Title = "Parent-Teacher Meeting", Description = "Discuss student progress and results", StartDate = DateTime.UtcNow.AddDays(5), EndDate = DateTime.UtcNow.AddDays(5).AddHours(4), Location = "Auditorium", Type = "Meeting", OrganizedBy = "", IsActive = true },
                new Event { Title = "Winter Holiday", Description = "School closed for winter break", StartDate = DateTime.UtcNow.AddDays(25), EndDate = DateTime.UtcNow.AddDays(35), Location = "N/A", Type = "Holiday", OrganizedBy = "" , IsActive = true}
            );
            dbContext.SaveChanges();
        }
    }

    private static DateTime UtcDate(int year, int month, int day) =>
        DateTime.SpecifyKind(new DateTime(year, month, day), DateTimeKind.Utc);
}

public interface IDatabaseSeeder
{
    void Seed();
}
