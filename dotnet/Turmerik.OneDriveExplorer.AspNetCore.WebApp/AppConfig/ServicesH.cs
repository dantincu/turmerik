using Turmerik.Core.Components;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.AppConfig
{
    public static class ServicesH
    {
        public static IAppSettings RegisterAppSettings(
            this IServiceCollection services)
        {
            var mtbl = new AppSettingsMtbl
            {
                DriveFolderCacheKeyName = "driveFolder",
                RootDriveFolderCacheKeyName = "rootDriveFolder",
                ClientAppRootObjPropName = "Trmrk",
                CacheKeyBasePrefix = "trmrk"
            };

            var immtbl = new AppSettingsImmtbl(mtbl);
            services.AddSingleton<IAppSettings>(immtbl);

            return immtbl;
        }
    }
}
