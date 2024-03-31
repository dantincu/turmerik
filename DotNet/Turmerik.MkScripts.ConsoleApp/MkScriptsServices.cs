using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkScripts.ConsoleApp
{
    public static class MkScriptsServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IProgramArgsRetriever, ProgramArgsRetriever>();
            services.AddSingleton<IProgramComponent, ProgramComponent>();

            return services;
        }
    }
}
