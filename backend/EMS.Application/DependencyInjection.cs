using EMS.Application.Interfaces;
using EMS.Application.Services;
using EMS.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace EMS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAttendanceService, AttendanceService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IBadgeService, BadgeService>();
        services.AddScoped<IClassService, ClassService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IExamService, ExamService>();
        services.AddScoped<IFeeService, FeeService>();
        services.AddScoped<ILibraryService, LibraryService>();
        services.AddScoped<IShiftService, ShiftService>();
        services.AddScoped<IStaffService, StaffService>();
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<ISubjectService, SubjectService>();
        services.AddScoped<ITimetableService, TimetableService>();

        services.AddScoped<IPasswordHasher<AppUser>, PasswordHasher<AppUser>>();
        services.AddHttpContextAccessor();

        return services;
    }
}
