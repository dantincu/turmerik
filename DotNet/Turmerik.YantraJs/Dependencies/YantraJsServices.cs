using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.YantraJs.Dependencies
{
    public static class YantraJsServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IJsScriptNormalizer, JsScriptNormalizer>();
            services.AddSingleton<IJsContextAdapterFactory, JsContextAdapterFactory>();

            return services;
        }
    }
}
