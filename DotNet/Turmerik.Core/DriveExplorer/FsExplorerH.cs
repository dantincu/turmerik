using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Dependencies;
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
            services.AddSvcIfReq<IFsExplorerServiceFactory, FsExplorerServiceFactory>();

            services.AddSvc(
                svcProv => svcProv.GetRequiredService<IFsExplorerServiceFactory>().Retriever(
                    allowSysFolders, allowNonSysDrives, rootDirPath), dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddExplorer(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            services.AddSvcIfReq<IFsExplorerServiceFactory, FsExplorerServiceFactory>();

            services.AddSvc(
                svcProv => svcProv.GetRequiredService<IFsExplorerServiceFactory>().Explorer(
                    allowSysFolders, allowNonSysDrives, rootDirPath), dependencyLifetime);

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
