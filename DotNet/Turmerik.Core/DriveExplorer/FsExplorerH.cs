using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Dependencies;
using Turmerik.Core.FileManager;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public static class FsExplorerH
    {
        public static IServiceCollection AddRetriever(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            services.AddFsManagerGuard(
                dependencyLifetime,
                allowSysFolders,
                allowNonSysDrives,
                rootDirPath);

            services.AddSvc<IFsItemsRetriever, FsItemsRetriever>(
                dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddExplorer(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            services.AddFsManagerGuard(
                dependencyLifetime,
                allowSysFolders,
                allowNonSysDrives,
                rootDirPath);

            services.AddSvc<IFsExplorerService, FsExplorerService>(
                dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddFsRetrieverAndExplorer(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            AddRetriever(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

            AddExplorer(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

            return services;
        }
    }
}
