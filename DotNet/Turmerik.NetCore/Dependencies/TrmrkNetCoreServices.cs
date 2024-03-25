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
using Turmerik.Core.Dependencies;

using LocalFilesCloner = Turmerik.NetCore.ConsoleApps.LocalFilesCloner;

namespace Turmerik.NetCore.Dependencies
{
    public static class TrmrkNetCoreServices
    {
        public static IServiceCollection RegisterAll(
            IServiceCollection services)
        {
            services.AddSingleton<IProcessLauncher, ProcessLauncher>();
            services.AddSingleton<IPowerShellAdapter, PowerShellAdapter>();
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
            services.AddSingleton<LocalFilesCloner.IProgramConfigRetriever, LocalFilesCloner.ProgramConfigRetriever>();
            services.AddSingleton<LocalFilesCloner.IProgramArgsRetriever, LocalFilesCloner.ProgramArgsRetriever>();
            services.AddSingleton<LocalFilesCloner.IProgramArgsNormalizer, LocalFilesCloner.ProgramArgsNormalizer>();

            services.AddSvc<LocalFilesCloner.IFileCloneComponent, LocalFilesCloner.FileCloneComponent>(
                fileCloneServicesLifetime);

            services.AddSvc<LocalFilesCloner.ICloningProfileComponent, LocalFilesCloner.CloningProfileComponent>(
                cloningProfileServiceLifetime ?? fileCloneServicesLifetime);

            services.AddSvc<LocalFilesCloner.IProgramComponent, LocalFilesCloner.ProgramComponent>(
                programServiceLifetime ?? fileCloneServicesLifetime);

            services.AddSvc<LocalFilesCloner.IFileCloneComponent, LocalFilesCloner.FileCloneComponent>(
                fileCloneServicesLifetime);

            return services;
        }
    }
}
