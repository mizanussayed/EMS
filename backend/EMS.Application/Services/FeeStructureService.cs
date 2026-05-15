using EMS.Application.DTOs;
using EMS.Application.Interfaces;
using EMS.Domain;
using Microsoft.EntityFrameworkCore;

namespace EMS.Application.Services;

internal sealed class FeeStructureService(IApplicationDbContext db, IAuditService audit) : IFeeStructureService
{
    public async Task<List<FeeStructureDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.FeeStructures
            .AsNoTracking()
            .LeftJoin(db.Classes, f => f.ClassId, c => c.Id, (f, c) => new { Structure = f, Class = c })
            .Select(f => new FeeStructureDto(
                f.Structure.Id,
                f.Structure.ClassId,
                f.Class != null ? f.Class.Name : string.Empty,
                f.Structure.Month,
                f.Structure.Amount,
                f.Structure.Description,
                f.Structure.IsActive,
                f.Structure.CreatedAt,
                f.Structure.UpdatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<FeeStructureDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var structure = await db.FeeStructures
            .AsNoTracking()
            .LeftJoin(db.Classes, f => f.ClassId, c => c.Id, (f, c) => new { Structure = f, Class = c })
            .Where(f => f.Structure.Id == id)
            .Select(f => new FeeStructureDto(
                f.Structure.Id,
                f.Structure.ClassId,
                f.Class != null ? f.Class.Name : string.Empty,
                f.Structure.Month,
                f.Structure.Amount,
                f.Structure.Description,
                f.Structure.IsActive,
                f.Structure.CreatedAt,
                f.Structure.UpdatedAt))
            .FirstOrDefaultAsync(cancellationToken);

        return structure;
    }

    public async Task<FeeStructureDto> CreateAsync(CreateFeeStructureRequest request, CancellationToken cancellationToken = default)
    {
        var feeStructure = new FeeStructure
        {
            ClassId = request.ClassId,
            Month = request.Month,
            Amount = request.Amount,
            Description = request.Description,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        db.FeeStructures.Add(feeStructure);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("CREATE", "FeeStructure", feeStructure.Id.ToString(), 
            $"Fee structure created for class ID {request.ClassId}, month: {request.Month}");

        return new FeeStructureDto(
            feeStructure.Id,
            feeStructure.ClassId,
            string.Empty,
            feeStructure.Month,
            feeStructure.Amount,
            feeStructure.Description,
            feeStructure.IsActive,
            feeStructure.CreatedAt,
            feeStructure.UpdatedAt);
    }

    public async Task<FeeStructureDto?> UpdateAsync(int id, UpdateFeeStructureRequest request, CancellationToken cancellationToken = default)
    {
        var feeStructure = await db.FeeStructures
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);

        if (feeStructure is null)
        {
            return null;
        }

        feeStructure.Month = request.Month;
        feeStructure.Amount = request.Amount;
        feeStructure.Description = request.Description;
        feeStructure.IsActive = request.IsActive;
        feeStructure.UpdatedAt = DateTime.UtcNow;

        db.FeeStructures.Update(feeStructure);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("UPDATE", "FeeStructure", id.ToString(), 
            $"Fee structure updated: month={request.Month}, amount={request.Amount}, active={request.IsActive}");

        return new FeeStructureDto(
            feeStructure.Id,
            feeStructure.ClassId,
            string.Empty,
            feeStructure.Month,
            feeStructure.Amount,
            feeStructure.Description,
            feeStructure.IsActive,
            feeStructure.CreatedAt,
            feeStructure.UpdatedAt);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var feeStructure = await db.FeeStructures
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);

        if (feeStructure is null)
        {
            return false;
        }

        db.FeeStructures.Remove(feeStructure);
        await db.SaveChangesAsync(cancellationToken);
        await audit.LogAsync("DELETE", "FeeStructure", id.ToString(), "Fee structure deleted");

        return true;
    }

    public async Task<List<FeeStructureDto>> GetByClassIdAsync(int classId, CancellationToken cancellationToken = default)
    {
        return await db.FeeStructures
            .AsNoTracking()
            .Where(f => f.ClassId == classId && f.IsActive)
            .LeftJoin(db.Classes, f => f.ClassId, c => c.Id, (f, c) => new { Structure = f, Class = c })
            .Select(f => new FeeStructureDto(
                f.Structure.Id,
                f.Structure.ClassId,
                f.Class != null ? f.Class.Name : string.Empty,
                f.Structure.Month,
                f.Structure.Amount,
                f.Structure.Description,
                f.Structure.IsActive,
                f.Structure.CreatedAt,
                f.Structure.UpdatedAt))
            .ToListAsync(cancellationToken);
    }
}
