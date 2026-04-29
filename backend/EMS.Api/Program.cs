using EMS.Api.Endpoints;
using EMS.Application;
using EMS.Application.Options;
using EMS.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);


var jwtSection = builder.Configuration.GetSection("Jwt");

builder.Services.Configure<JwtOptions>(jwtSection);

var jwtOptions = jwtSection.Get<JwtOptions>()
    ?? throw new InvalidOperationException("JWT configuration is missing");

// Validate Secret
if (string.IsNullOrWhiteSpace(jwtOptions.Secret) || jwtOptions.Secret.Length < 32)
{
    throw new InvalidOperationException("JWT Secret must be at least 32 characters long.");
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

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.Secret)),

            ClockSkew = TimeSpan.Zero // no extra tolerance
        };
    });

// ----------------------
// Authorization Policies
// ----------------------
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("StaffOnly", policy =>
        policy.RequireRole("Admin", "Teacher", "Accountant"))
    .AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin(); // ⚠️ change this in production
    });
});


builder.Services.AddOpenApi();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();

    if (app.Environment.IsDevelopment())
    {
        seeder.Seed();
    }
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi("/openapi/v1.json");

app.MapScalarApiReference("/openapi", options =>
{
    options.WithOpenApiRoutePattern("/openapi/v1.json");
});

// API Endpoints

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
app.MapGet("/api/health", () =>
    Results.Ok(new { status = "Healthy" }))
    .WithName("Health");

app.Run();