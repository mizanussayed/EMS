namespace EMS.Application.Options;

public class JwtOptions
{
    public string Issuer { get; set; } = "EMS.Api";
    public string Audience { get; set; } = "EMS.Client";
    public string Secret { get; set; } = string.Empty;
}
