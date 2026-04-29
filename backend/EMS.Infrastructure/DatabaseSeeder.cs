using EMS.Domain;
using EMS.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace EMS.Infrastructure;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher<AppUser> _passwordHasher;

    public DatabaseSeeder(AppDbContext dbContext, IPasswordHasher<AppUser> passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }

    public void Seed()
    {
        _dbContext.Database.EnsureCreated();

        if (!_dbContext.Classes.Any())
        {
            _dbContext.Classes.AddRange(
                new SchoolClass { Name = "Grade 1", Section = "A", Room = "Room 101", Schedule = "Morning Shift", ClassTeacher = "Mr. John Doe" },
                new SchoolClass { Name = "Grade 1", Section = "B", Room = "Room 102", Schedule = "Morning Shift", ClassTeacher = "Ms. Jane Smith" },
                new SchoolClass { Name = "Grade 2", Section = "A", Room = "Room 201", Schedule = "Afternoon Shift", ClassTeacher = "Mr. Robert Brown" }
            );
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Subjects.Any())
        {
            _dbContext.Subjects.AddRange(
                new Subject { Name = "Mathematics", Code = "MATH-10", Teacher = "Dr. Robert Williams", Classes = "Grade 1, Grade 2", Credits = 4, Type = "Core" },
                new Subject { Name = "English Literature", Code = "ENG-10", Teacher = "Ms. Jennifer Clark", Classes = "Grade 1", Credits = 3, Type = "Core" },
                new Subject { Name = "Physics", Code = "PHY-10", Teacher = "Mr. David Martinez", Classes = "Grade 2", Credits = 4, Type = "Core" }
            );
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Staff.Any())
        {
            _dbContext.Staff.AddRange(
                new Staff { Name = "Dr. Robert Williams", Subject = "Mathematics", Email = "r.williams@school.edu", Phone = "+1 555-1001", Qualification = "PhD in Mathematics", Experience = "15 years", Classes = "Grade 1, Grade 2", Status = "Active", DateOfJoining = new DateTime(2010, 8, 15), Role = "Teacher" },
                new Staff { Name = "Ms. Jennifer Clark", Subject = "English Literature", Email = "j.clark@school.edu", Phone = "+1 555-1002", Qualification = "MA in English", Experience = "10 years", Classes = "Grade 1", Status = "Active", DateOfJoining = new DateTime(2015, 7, 20), Role = "Teacher" }
            );
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Students.Any())
        {
            _dbContext.Students.AddRange(
                new Student
                {
                    FirstName = "Ayesha",
                    LastName = "Khan",
                    AdmissionNumber = "S1001",
                    ClassName = "Grade 1",
                    Section = "A",
                    DateOfBirth = new DateTime(2018, 4, 12),
                    Gender = "Female"
                },
                new Student
                {
                    FirstName = "Rahul",
                    LastName = "Sharma",
                    AdmissionNumber = "S1002",
                    ClassName = "Grade 2",
                    Section = "B",
                    DateOfBirth = new DateTime(2017, 9, 3),
                    Gender = "Male"
                });
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Users.Any())
        {
            var admin = new AppUser
            {
                UserName = "admin",
                Role = "Admin"
            };
            admin.PasswordHash = _passwordHasher.HashPassword(admin, "Password123");
            _dbContext.Users.Add(admin);
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Exams.Any())
        {
            _dbContext.Exams.AddRange(
                new Exam { Title = "Mid-term Examination 2025", Type = "Mid-term", StartDate = new DateTime(2025, 12, 1), EndDate = new DateTime(2025, 12, 15), Status = "Scheduled" },
                new Exam { Title = "Unit Test - I", Type = "Unit Test", StartDate = new DateTime(2025, 11, 20), EndDate = new DateTime(2025, 11, 25), Status = "Completed" }
            );
            _dbContext.SaveChanges();

            var exam = _dbContext.Exams.First(e => e.Status == "Completed");
            var student = _dbContext.Students.First();
            if (!_dbContext.ExamResults.Any())
            {
                _dbContext.ExamResults.AddRange(
                    new ExamResult { ExamId = exam.Id, StudentId = student.Id, SubjectName = "Mathematics", MarksObtained = 85, TotalMarks = 100, Grade = "A", Remarks = "Excellent performance" },
                    new ExamResult { ExamId = exam.Id, StudentId = student.Id, SubjectName = "Physics", MarksObtained = 78, TotalMarks = 100, Grade = "B+", Remarks = "Good, but can improve" }
                );
                _dbContext.SaveChanges();
            }
        }

        if (!_dbContext.TimetableEntries.Any())
        {
            _dbContext.TimetableEntries.AddRange(
                new TimetableEntry { ClassName = "Grade 1", SubjectName = "Mathematics", TeacherName = "Dr. Robert Williams", DayOfWeek = "Monday", StartTime = "08:00", EndTime = "09:00", Room = "Room 101" },
                new TimetableEntry { ClassName = "Grade 1", SubjectName = "English Literature", TeacherName = "Ms. Jennifer Clark", DayOfWeek = "Tuesday", StartTime = "09:00", EndTime = "10:00", Room = "Room 102" },
                new TimetableEntry { ClassName = "Grade 2", SubjectName = "Physics", TeacherName = "Mr. David Martinez", DayOfWeek = "Monday", StartTime = "08:00", EndTime = "09:00", Room = "Room 201" }
            );
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Fees.Any())
        {
            var student1 = _dbContext.Students.First();
            _dbContext.Fees.AddRange(
                new Fee { StudentId = student1.Id, Month = "November 2025", Amount = 5000, PaidAmount = 5000, Status = "Paid", PaymentDate = DateTime.UtcNow, PaymentMethod = "Cash" },
                new Fee { StudentId = student1.Id, Month = "December 2025", Amount = 5000, PaidAmount = 0, Status = "Pending" }
            );
            _dbContext.SaveChanges();
        }

        if (!_dbContext.Books.Any())
        {
            _dbContext.Books.AddRange(
                new Book { Title = "Advanced Calculus", Author = "Isaac Newton", ISBN = "978-0123456789", Category = "Mathematics", Quantity = 10, AvailableQuantity = 9, RackNumber = "M-01" },
                new Book { Title = "Quantum Physics", Author = "Richard Feynman", ISBN = "978-0987654321", Category = "Science", Quantity = 5, AvailableQuantity = 5, RackNumber = "S-05" }
            );
            _dbContext.SaveChanges();

            if (!_dbContext.BookIssues.Any())
            {
                var book = _dbContext.Books.First();
                var student = _dbContext.Students.First();
                _dbContext.BookIssues.Add(new BookIssue
                {
                    BookId = book.Id,
                    StudentId = student.Id,
                    IssueDate = DateTime.UtcNow.AddDays(-5),
                    DueDate = DateTime.UtcNow.AddDays(9),
                    Status = "Issued"
                });
                _dbContext.SaveChanges();
            }
        }

        if (!_dbContext.Events.Any())
        {
            _dbContext.Events.AddRange(
                new Event { Title = "Annual Sports Day", Description = "Inter-house sports competitions", StartDate = DateTime.UtcNow.AddDays(15), EndDate = DateTime.UtcNow.AddDays(15).AddHours(8), Location = "Main Sports Ground", Type = "Sports" },
                new Event { Title = "Parent-Teacher Meeting", Description = "Discuss student progress and results", StartDate = DateTime.UtcNow.AddDays(5), EndDate = DateTime.UtcNow.AddDays(5).AddHours(4), Location = "Auditorium", Type = "Meeting" },
                new Event { Title = "Winter Holiday", Description = "School closed for winter break", StartDate = DateTime.UtcNow.AddDays(25), EndDate = DateTime.UtcNow.AddDays(35), Location = "N/A", Type = "Holiday" }
            );
            _dbContext.SaveChanges();
        }
    }
}

public interface IDatabaseSeeder
{
    void Seed();
}
