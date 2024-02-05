using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.NetCore.Dependencies;
using Turmerik.Notes.BlazorApp.Services;

namespace Turmerik.Notes.BlazorApp.Dependencies
{
    public static class TrmrkNotesBlazorAppServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            TrmrkServices.RegisterAll(services);
            TrmrkNetCoreServices.RegisterAll(services);

            services.AddSingleton<NotesBlazorAppModuleFactory>();
            return services;
        }
    }
}
