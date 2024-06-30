using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Jint.Behavior;

namespace Turmerik.Jint.Dependencies
{
    public static class TrmrkJintServices
    {
        public static IServiceCollection RegisterAll(
            this IServiceCollection services)
        {
            services.AddSingleton<ITrmrkJintAdapterFactory, TrmrkJintAdapterFactory>();
            services.AddSingleton<AppBehaviorSetupAdapterFactory>();
            services.AddSingleton<IAppBehaviorFactory, AppBehaviorFactory>();
            services.AddSingleton<ITrmrkJintOrchestrator, TrmrkJintOrchestrator>();

            return services;
        }
    }
}
