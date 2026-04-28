using EMS.Domain;

namespace EMS.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
    RefreshToken GenerateRefreshToken();
}
