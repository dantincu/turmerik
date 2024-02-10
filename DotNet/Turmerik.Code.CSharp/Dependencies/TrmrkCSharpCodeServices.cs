using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.CSharp.Cloneables;

namespace Turmerik.Code.CSharp.Dependencies
{
    public static class TrmrkCSharpCodeServices
    {
        public static IServiceCollection RegisterAll(
            this IServiceCollection services)
        {
            services.AddSingleton<ICloneableTypesCodeGenerator, CloneableTypesCodeGenerator>();

            return services;
        }
    }
}
