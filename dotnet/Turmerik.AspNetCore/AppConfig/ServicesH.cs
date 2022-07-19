using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.Infrastucture;

namespace Turmerik.AspNetCore.AppConfig
{
    public static class ServicesH
    {
        public static IAppSettings RegisterAppSettings(
            this IServiceCollection services,
            IConfiguration config,
            ITypesStaticDataCache typesStaticDataCache)
        {
            var mtbl = config.GetObject<AppSettingsMtbl>(
                typesStaticDataCache,
                ConfigKeysH.TRMRK,
                typeof(AppSettingsMtbl),
                mtb =>
                {
                    mtb.ApiFolderRelUri = mtb.ApiFolderRelUri ?? "api/driveFolder";
                    mtb.ApiFileRelUri = mtb.ApiFileRelUri ?? "api/driveFile";
                    mtb.ApiExplorerRelUri = mtb.ApiExplorerRelUri ?? "api/explorer";
                    mtb.DriveFolderCacheKeyName = mtb.DriveFolderCacheKeyName ?? "driveFolder";
                    mtb.RootDriveFolderCacheKeyName = mtb.RootDriveFolderCacheKeyName ?? "rootDriveFolder";
                    mtb.DriveItemMacrosCacheKeyName = mtb.DriveItemMacrosCacheKeyName ?? "driveItemMacros";
                    mtb.ClientAppRootObjPropName = mtb.ClientAppRootObjPropName ?? "Trmrk";
                    mtb.CacheKeyBasePrefix = mtb.CacheKeyBasePrefix ?? "trmrk";
                    mtb.DriveFolderIdUrlQueryKey = mtb.DriveFolderIdUrlQueryKey ?? "drive-folder-id";
                    mtb.GetDriveItemMacrosActionName = mtb.GetDriveItemMacrosActionName ?? "getDriveItemMacros";
                });

            var immtbl = new AppSettingsImmtbl(mtbl);
            services.AddSingleton<IAppSettings>(immtbl);

            return immtbl;
        }
    }
}
