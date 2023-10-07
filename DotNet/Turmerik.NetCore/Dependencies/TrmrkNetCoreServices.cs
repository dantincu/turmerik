using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.LocalDevice.Core.Env;
using Turmerik.Utility;

namespace Turmerik.NetCore.Dependencies
{
    public static class TrmrkNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<INetCoreAppEnvFactoryCore, NetCoreAppEnvFactoryCore>();

            return services;
        }
    }
}
