using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.AppConfig
{
    public static class ServicesH
    {
        public static IAppSettings RegisterAppSettings(
            this IServiceCollection services,
            ITypesStaticDataCache typesStaticDataCache,
            ILambdaExprHelperFactory lambdaExprHelperFactory)
        {
            var lambdaExprHelper = lambdaExprHelperFactory.GetHelper<DriveItem>();
            var typeWrapper = typesStaticDataCache.Get<DriveItem>();

            var allDriveItemPropNames = typeWrapper.AllProps.Value.Select(
                    prop => prop.Name).RdnlC();

            var reqDriveItemPropNames = new string[]
            {
                lambdaExprHelper.Name(o => o.Id),
                lambdaExprHelper.Name(o => o.Name),
                lambdaExprHelper.Name(o => o.CreationTimeStr),
                lambdaExprHelper.Name(o => o.LastAccessTimeStr),
                lambdaExprHelper.Name(o => o.LastWriteTimeStr),
            }.RdnlC();

            var reqDriveFolderPropNames = new string[]
            {
                lambdaExprHelper.Name(o => o.IsFolder),
            }.RdnlC();

            var reqDriveFilePropNames = new string[]
            {
            }.RdnlC();

            var mtbl = new AppSettingsMtbl
            {
                DriveFolderCacheKeyName = "driveFolder",
                RootDriveFolderCacheKeyName = "rootDriveFolder",
                ClientAppRootObjPropName = "Trmrk",
                CacheKeyBasePrefix = "trmrk",
                AllDriveItemPropNames = allDriveItemPropNames,
                ReqDriveItemPropNames = reqDriveItemPropNames,
                ReqDriveFolderPropNames = reqDriveFolderPropNames,
                ReqDriveFilePropNames = reqDriveFilePropNames
            };

            var immtbl = new AppSettingsImmtbl(mtbl);
            services.AddSingleton<IAppSettings>(immtbl);

            return immtbl;
        }
    }
}
