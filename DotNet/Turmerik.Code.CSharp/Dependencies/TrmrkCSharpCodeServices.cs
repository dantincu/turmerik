using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Code.CSharp.Components;
using Turmerik.Code.CSharp.Components.ClnblTypesCsCode;

namespace Turmerik.Code.CSharp.Dependencies
{
    public static class TrmrkCSharpCodeServices
    {
        public static IServiceCollection RegisterAll(
            this IServiceCollection services)
        {
            services.AddSingleton<ISyntaxNodeTraversal, DefaultSyntaxNodeTraversal>();
            services.AddSingleton<IClnblTypesCsCodeParser, ClnblTypesCsCodeParser>();
            services.AddSingleton<IClnblIntfCfgTypeCsCodeParser, ClnblIntfCfgTypeCsCodeParser>();
            services.AddSingleton<IClnblTypesCsCodeGenerator, ClnblTypesCsCodeGenerator>();
            return services;
        }
    }
}
