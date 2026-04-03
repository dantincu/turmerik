using Turmerik.GoogleDriveNotes.WebApi.Services;

namespace Turmerik.GoogleDriveNotes.WebApi.Dependencies
{
    public static class AppServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<WebAppConfig>();

            return services;
        }
    }
}
