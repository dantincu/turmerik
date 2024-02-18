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

using FilesCloner = Turmerik.NetCore.ConsoleApps.FilesCloner;
using ClonerConfigGenerator = Turmerik.NetCore.ConsoleApps.FilesClonerConfigFilesGenerator;

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
            services.AddSingleton<FilesCloner.IProgramConfigRetriever, FilesCloner.ProgramConfigRetriever>();
            services.AddSingleton<FilesCloner.IProgramArgsRetriever, FilesCloner.ProgramArgsRetriever>();
            services.AddSingleton<FilesCloner.IProgramArgsNormalizer, FilesCloner.ProgramArgsNormalizer>();

            services.AddSvc<FilesCloner.IFileCloneComponent, FilesCloner.FileCloneComponent>(
                fileCloneServicesLifetime);

            services.AddSvc<FilesCloner.ICloningProfileComponent, FilesCloner.CloningProfileComponent>(
                cloningProfileServiceLifetime ?? fileCloneServicesLifetime);

            services.AddSvc<FilesCloner.IProgramComponent, FilesCloner.ProgramComponent>(
                programServiceLifetime ?? fileCloneServicesLifetime);

            services.AddSvc<ClonerConfigGenerator.IProgramComponent, ClonerConfigGenerator.ProgramComponent>(
                programServiceLifetime ?? fileCloneServicesLifetime);

            return services;
        }
    }
}
