using EMS.Api.Data;
using EMS.Api.Endpoints;
using EMS.Api.Models;
using EMS.Api.Options;
using EMS.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = "Data Source=ems.db";
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (connectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwtOptions.Key))
{
    throw new InvalidOperationException("Jwt:Key is missing in configuration.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key))
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("StaffOnly", policy =>
        policy.RequireRole("Admin", "Teacher", "Accountant"))
    .AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

builder.Services.AddSingleton(jwtOptions);
builder.Services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AppUser>>();
    db.Database.EnsureCreated();

    if (!db.Students.Any())
    {
        db.Students.AddRange(
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
        db.SaveChanges();
    }

    if (!db.Attendances.Any())
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var students = db.Students.ToList();
        if (students.Count > 0)
        {
            db.Attendances.AddRange(
                students.Select((student, index) => new Attendance
                {
                    StudentId = student.Id,
                    Date = today,
                    Status = index % 2 == 0 ? "Present" : "Absent",
                    Notes = index % 2 == 0 ? null : "Sick leave"
                }));
            db.SaveChanges();
        }
    }

    if (!db.Users.Any())
    {
        var admin = new AppUser
        {
            UserName = "admin",
            Role = "Admin"
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Password123");
        db.Users.Add(admin);
        db.SaveChanges();
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapDashboardEndpoints();
app.MapStudentEndpoints();
app.MapAttendanceEndpoints();
app.MapAuditEndpoints();
app.MapAuthEndpoints();

app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" })).WithName("Health");

app.Run();
