using EMS.Api.Endpoints;
using EMS.Application;
using EMS.Application.Options;
using EMS.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);


var jwtSection = builder.Configuration.GetSection("Jwt");

builder.Services.Configure<JwtOptions>(jwtSection);

var jwtOptions = jwtSection.Get<JwtOptions>()
    ?? throw new InvalidOperationException("JWT configuration is missing");


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


builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

// ----------------------
// Authorization Policies
// ----------------------
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("StaffOnly", policy =>
        policy.RequireRole("ADMIN", "TEACHER", "ACCOUNTANT"))
    .AddPolicy("AdminOnly", policy =>
        policy.RequireRole("ADMIN"))
    .AddPolicy("StudentOnly", policy =>
        policy.RequireRole("STUDENT"));


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});


builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        var securityScheme = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Name = "Bearer",
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter your JWT token"
        };

        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
        document.Components.SecuritySchemes.Add("Bearer", securityScheme);

        document?.Security?.Add(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecuritySchemeReference("Bearer", document),
                new List<string>()
            }
        });

        return Task.CompletedTask;
    });
});


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();

    if (app.Environment.IsDevelopment())
    {
        seeder.Seed();
    }
}
app.UseForwardedHeaders();
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
app.MapAuthEndpoints();
app.MapDashboardEndpoints();
app.MapStudentEndpoints();
app.MapClassEndpoints();
app.MapShiftEndpoints();
app.MapBadgeEndpoints();
app.MapSubjectEndpoints();
app.MapStaffEndpoints();
app.MapExamEndpoints();
app.MapTimetableEndpoints();
app.MapFeeEndpoints();
app.MapFeeStructureEndpoints();
app.MapLibraryEndpoints();
app.MapEventEndpoints();
app.MapAttendanceEndpoints();
app.MapAuditEndpoints();

app.MapGet("", () =>
     Results.Content("Welcome to the EMS API!", "text/plain"))
    .WithName("Home");


app.MapGet("/api/health", () =>
    Results.Ok(new { status = "Healthy" }))
    .WithName("Health");

app.Run();
