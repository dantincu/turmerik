using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.NetCore.LocalDeviceEnv;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Md;
using Turmerik.NetCore.Utility;
using Turmerik.NetCore.ConsoleApps.FilesCloner;
using Turmerik.Core.Dependencies;

namespace Turmerik.NetCore.Dependencies
{
    public static class TrmrkNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IProcessLauncher, ProcessLauncher>();
            services.AddSingleton<INetCoreAppEnvFactoryCore, NetCoreAppEnvFactoryCore>();
            services.AddSingleton<TextToMdService>();

            return services;
        }

        public static IServiceCollection AddFilesClonerServices(
            IServiceCollection services,
            ServiceLifetime fileCloneServicesLifetime = ServiceLifetime.Scoped,
            ServiceLifetime? cloningProfileServiceLifetime = null,
            ServiceLifetime? programServiceLifetime = null)
        {
            services.AddSingleton<IProgramArgsRetriever, ProgramArgsRetriever>();
            services.AddSingleton<IProgramArgsNormalizer, ProgramArgsNormalizer>();

            services.AddSvc<IFileCloneComponent, FileCloneComponent>(
                fileCloneServicesLifetime);

            services.AddSvc<ICloningProfileComponent, CloningProfileComponent>(
                cloningProfileServiceLifetime ?? fileCloneServicesLifetime);

            services.AddSvc<IProgramComponent, ProgramComponent>(
                programServiceLifetime ?? fileCloneServicesLifetime);

            return services;
        }
    }
}
