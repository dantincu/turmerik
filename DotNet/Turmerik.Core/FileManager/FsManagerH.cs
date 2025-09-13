using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.Core.Dependencies;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.Core.FileManager
{
    public static class FsManagerH
    {
        public const string DRIVE_ITEM_OUTDATED_CLIENT_FETCH_TIMESTAMP_ERROR_CODE = "OUTDATED-CLIENT-FETCH-TIMESTAMP";

        public static IServiceCollection AddFsManagerGuard(
            this IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            services.AddSvcIfReq<IFsManagerGuardFactory, FsManagerGuardFactory>();

            services.AddSvc(
                svcProv => svcProv.GetRequiredService<IFsManagerGuardFactory>().Create(
                    allowSysFolders, allowNonSysDrives, rootDirPath), dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddFsManager(
            this IServiceCollection services,
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

            services.AddSvc<IFsManagerService, FsManagerService>(
                dependencyLifetime);

            return services;
        }
    }
}
