using Turmerik.Core.Dependencies;
using Turmerik.Dependencies;
using Turmerik.NetCore.Dependencies;

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

            return services;
        }
    }
}
