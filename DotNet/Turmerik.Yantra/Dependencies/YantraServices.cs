using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Dependencies;
using Turmerik.Yantra.Components;

namespace Turmerik.Yantra.Dependencies
{
    public static class YantraServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkCoreServices.RegisterAll(services);
            services = RegisterAllCore(services);

            return services;
        }

        public static IServiceCollection RegisterAllCore(
            IServiceCollection services)
        {
            services.AddSingleton<IJsConsoleFactory, JintConsoleFactory>();
            services.AddSingleton<IJsCodeTransformer, JsCodeTransformer>();
            services.AddSingleton<IYantraComponentFactory, YantraComponentFactory>();

            return services;
        }
    }
}
