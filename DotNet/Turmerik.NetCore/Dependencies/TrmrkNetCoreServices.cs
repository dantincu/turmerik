using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Utility;
using Turmerik.NetCore.LocalDeviceEnv;
using Turmerik.NetCore.Md;
using Turmerik.NetCore.Reflection.AssemblyLoading;
using Turmerik.NetCore.Utility;
using DotNetTypesToTypescript = Turmerik.NetCore.ConsoleApps.DotNetTypesToTypescript;
using LocalFilesCloner = Turmerik.NetCore.ConsoleApps.LocalFilesCloner;
using MkFiles = Turmerik.NetCore.ConsoleApps.MkFiles;
using MkScripts = Turmerik.NetCore.ConsoleApps.MkScripts;
using SyncLocalFiles = Turmerik.NetCore.ConsoleApps.SyncLocalFiles;

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

            services.AddSingleton<AssemblyLoader>();
            services.AddSingleton<IClipboardService, TrmrkClipboardService>();

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

        public static IServiceCollection AddMkScriptsServices(
            IServiceCollection services)
        {
            services.AddSingleton<MkScripts.IProgramBehaviorRetriever, MkScripts.ProgramBehaviorRetriever>();
            services.AddSingleton<MkScripts.IProgramArgsRetriever, MkScripts.ProgramArgsRetriever>();
            services.AddSingleton<MkScripts.IProgramArgsNormalizer, MkScripts.ProgramArgsNormalizer>();
            services.AddSingleton<MkScripts.IFilteredItemsRetriever, MkScripts.FilteredItemsRetriever>();
            services.AddSingleton<MkScripts.IProgramComponent, MkScripts.ProgramComponent>();

            return services;
        }

        public static IServiceCollection AddSyncLocalFilesServices(
            IServiceCollection services)
        {
            services.AddSingleton<SyncLocalFiles.IProgramConfigRetriever, SyncLocalFiles.ProgramConfigRetriever>();
            services.AddSingleton<SyncLocalFiles.IProgramArgsRetriever, SyncLocalFiles.ProgramArgsRetriever>();
            services.AddSingleton<SyncLocalFiles.IProgramArgsNormalizer, SyncLocalFiles.ProgramArgsNormalizer>();
            services.AddSingleton<SyncLocalFiles.IProgramComponent, SyncLocalFiles.ProgramComponent>();

            return services;
        }

        public static IServiceCollection AddMkFilesServices(
            IServiceCollection services)
        {
            services.AddSingleton<MkFiles.IProgramComponent, MkFiles.ProgramComponent>();

            return services;
        }

        public static IServiceCollection AddDotNetTypesToTypescriptServices(
            this IServiceCollection services)
        {
            services.AddSingleton<DotNetTypesToTypescript.IProgramConfigRetriever, DotNetTypesToTypescript.ProgramConfigRetriever>();
            services.AddSingleton<DotNetTypesToTypescript.IProgramArgsRetriever, DotNetTypesToTypescript.ProgramArgsRetriever>();
            services.AddSingleton<DotNetTypesToTypescript.IProgramArgsNormalizer, DotNetTypesToTypescript.ProgramArgsNormalizer>();
            services.AddSingleton<DotNetTypesToTypescript.IProgramComponent, DotNetTypesToTypescript.ProgramComponent>();

            return services;
        }
    }
}
