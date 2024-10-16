using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Linq;
using Turmerik.Core.Dependencies;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.DriveExplorer
{
    public static class DriveExplorerH
    {
        public const int DEFAULT_ENTRY_NAME_MAX_LENGTH = 100;

        public const string DIR_PAIRS_CFG_FILE_NAME = "trmrk-dirpairs-config.json";

        public static IServiceCollection AddFsRetriever(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            FsExplorerH.AddRetriever(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

            services.AddSvc<IDriveItemsRetriever>(
                svcProv => svcProv.GetRequiredService<IFsExplorerServiceFactory>().Retriever(
                    allowSysFolders, allowNonSysDrives, rootDirPath), dependencyLifetime);

            return services;
        }

        public static IServiceCollection AddFsExplorer(
            IServiceCollection services,
            ServiceLifetime? dependencyLifetime = null,
            bool allowSysFolders = false,
            bool allowNonSysDrives = false,
            string rootDirPath = null)
        {
            FsExplorerH.AddExplorer(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

            services.AddSvc<IDriveExplorerService>(
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
            AddFsRetriever(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

            AddFsExplorer(
                services, dependencyLifetime,
                allowSysFolders, allowNonSysDrives, rootDirPath);

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

        public static DriveItem? FindByName(
            this List<DriveItem> list, string name) => list.SingleOrDefault(
                item => item.Name == name);

        public static DriveItemCore? FindByName(
            this List<DriveItemCore> list, string name) => list.SingleOrDefault(
                item => item.Name == name);

        public static bool HasWithName(
            this List<DriveItem> list, string name) => list.Any(
                item => item.Name == name);

        public static bool HasWithName(
            this List<DriveItemCore> list, string name) => list.Any(
                item => item.Name == name);

        public static DriveItemX ToItemX(
            this DriveItem src,
            int depth = 0) => new DriveItemX(
                src, depth);

        public static DriveItemCore ToItemCore(
            this DriveItem src) => new DriveItemCore(src);

        public static List<DriveItemCore> ToItemCoreList(
            this List<DriveItem> list) => list.Select(
                ToItemCore).ToList();

        public static DriveItem ToItem(
            this DriveItemCore item) => new DriveItem(item);

        public static List<DriveItem> ToItemList(
            this List<DriveItemCore> list) => list.Select(
                ToItem).ToList();
    }
}
