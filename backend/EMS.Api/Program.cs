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
builder.Services.AddApplicationServices();

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
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    seeder.Seed();
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
