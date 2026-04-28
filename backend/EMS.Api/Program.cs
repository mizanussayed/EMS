using EMS.Application;
using EMS.Application.Options;
using EMS.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Scalar.AspNetCore;
using EMS.Api.Endpoints;
using EMS.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Auth Configuration
var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret))
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("StaffOnly", policy =>
        policy.RequireRole("Admin", "Teacher", "Accountant"))
    .AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Seed Database
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
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Map Endpoints
app.MapDashboardEndpoints();
app.MapStudentEndpoints();
app.MapClassEndpoints();
app.MapSubjectEndpoints();
app.MapStaffEndpoints();
app.MapExamEndpoints();
app.MapTimetableEndpoints();
app.MapFeeEndpoints();
app.MapLibraryEndpoints();
app.MapEventEndpoints();
app.MapAttendanceEndpoints();
app.MapAuditEndpoints();
app.MapAuthEndpoints();

app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" })).WithName("Health");

app.Run();
