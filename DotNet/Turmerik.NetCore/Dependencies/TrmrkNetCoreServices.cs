using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.LocalDeviceEnv;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Md;

namespace Turmerik.NetCore.Dependencies
{
    public static class TrmrkNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<INetCoreAppEnvFactoryCore, NetCoreAppEnvFactoryCore>();
            services.AddSingleton<TextToMdService>();
            return services;
        }
    }
}
