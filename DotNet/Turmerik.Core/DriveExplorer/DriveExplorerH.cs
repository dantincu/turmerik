using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.DriveExplorer
{
    public static class DriveExplorerH
    {
        public const int DEFAULT_ENTRY_NAME_MAX_LENGTH = 100;

        public const string DIR_PAIRS_CFG_FILE_NAME = "trmrk-dirpairs-config.json";

        public static IServiceCollection AddFsRetriever(
            IServiceCollection services,
            DependencyLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            string rootDirPath = null)
        {
            FsExplorerH.AddRetriever(
                services, dependencyLifetime,
                allowSysFolders, rootDirPath);

            services.AddSvc<IDriveItemsRetriever>(
                svcProv => svcProv.GetRequiredService<IFsExplorerServiceFactory>().Retriever(
                    allowSysFolders, rootDirPath), dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddFsExplorer(
            IServiceCollection services,
            DependencyLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            string rootDirPath = null)
        {
            FsExplorerH.AddExplorer(
                services, dependencyLifetime,
                allowSysFolders, rootDirPath);

            services.AddSvc<IDriveExplorerService>(
                svcProv => svcProv.GetRequiredService<IFsExplorerServiceFactory>().Explorer(
                    allowSysFolders, rootDirPath), dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddFsRetrieverAndExplorer(
            IServiceCollection services,
            DependencyLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            string rootDirPath = null)
        {
            AddFsRetriever(
                services, dependencyLifetime,
                allowSysFolders, rootDirPath);

            AddFsExplorer(
                services, dependencyLifetime,
                allowSysFolders, rootDirPath);

            return services;
        }

        public static void CopyChildren<TDriveItem>(
            DriveItem<TDriveItem> destn,
            List<TDriveItem>? srcFolders,
            List<TDriveItem>? srcFiles,
            int depth = 0)
            where TDriveItem : DriveItem<TDriveItem>
        {
            if (depth > 0)
            {
                int childrenDepth = depth - 1;

                destn.SubFolders = srcFolders?.Select(
                    item => item.CreateFromSrc<TDriveItem>(null, childrenDepth)).ToList();

                destn.FolderFiles = srcFiles?.Select(
                    item => item.CreateFromSrc<TDriveItem>(null, 0)).ToList();
            }
            else if (depth < 0)
            {
                destn.SubFolders = srcFolders;
                destn.FolderFiles = srcFiles;
            }
        }

        public static DriveItemX ToItemX(
            this DriveItem src,
            int depth = 0) => new DriveItemX(
                src, depth);
    }
}
