using EMS.Api.Data;
using EMS.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace EMS.Api.Services;

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
    }
}

public interface IDatabaseSeeder
{
    void Seed();
}