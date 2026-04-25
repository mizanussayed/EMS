namespace EMS.Api.Options;

public class JwtOptions
{
    public string Issuer { get; set; } = "EMS.Api";
    public string Audience { get; set; } = "EMS.Client";
    public string Key { get; set; } = string.Empty;
}
