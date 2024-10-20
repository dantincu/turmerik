using Turmerik.NetCore.Utility;

namespace Turmerik.LocalFilesExplorerAnonymous.WebApi.Helpers
{
    public class AppH
    {
        private AppH(IConfiguration configuration)
        {
            AllowedClientHosts = configuration.GetCfgValue<string[]>(
                ["Turmerik", "AllowedClientHosts"]) ?? throw new InvalidOperationException(
                    string.Join(" ", "Invalid configuration file: the appsettings.{environment}.json file should contain",
                        "section Turmerik with property AllowedClientHosts containing an array of allowed client hosts"));

            string? allowAnonymousAuthenticationEnvVar = Environment.GetEnvironmentVariable(
                "TURMERIK_ALLOW_ANONYMOUS_AUTH");

            AllowAnonymousAuthentication = true;
        }

        public static AppH Instance { get; private set; }

        public string[] AllowedClientHosts { get; }

        public bool AllowAnonymousAuthentication { get; }

        public static void InitSingleton(
            IConfiguration configuration)
        {
            Instance = new AppH(configuration);
        }
    }
}
