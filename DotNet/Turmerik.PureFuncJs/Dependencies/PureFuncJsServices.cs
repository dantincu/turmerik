using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Dependencies;
using Turmerik.PureFuncJs.JintCompnts;

namespace Turmerik.PureFuncJs.Dependencies
{
    public static class PureFuncJsServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            TrmrkServices.RegisterAll(services);
            services = RegisterAllCore(services);

            return services;
        }

        public static IServiceCollection RegisterAllCore(
            IServiceCollection services)
        {
            services.AddSingleton<IJintConsoleFactory, JintConsoleFactory>();
            services.AddSingleton<IJsCodeTransformer, JsCodeTransformer>();
            services.AddSingleton<IJintComponentFactory, JintComponentFactory>();

            return services;
        }
    }
}
