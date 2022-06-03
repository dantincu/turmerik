using System.Collections.ObjectModel;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.AppConfig
{
    public interface IAppSettings
    {
        string DriveFolderCacheKeyName { get; }
        string RootDriveFolderCacheKeyName { get; }
        string ClientAppRootObjPropName { get; }
        string CacheKeyBasePrefix { get; }
    }

    public class AppSettingsImmtbl : IAppSettings
    {
        public AppSettingsImmtbl(IAppSettings src)
        {
            DriveFolderCacheKeyName = src.DriveFolderCacheKeyName;
            RootDriveFolderCacheKeyName = src.RootDriveFolderCacheKeyName;
            ClientAppRootObjPropName = src.ClientAppRootObjPropName;
            CacheKeyBasePrefix = src.CacheKeyBasePrefix;
        }

        public string DriveFolderCacheKeyName { get; }
        public string RootDriveFolderCacheKeyName { get; }
        public string ClientAppRootObjPropName { get; }
        public string CacheKeyBasePrefix { get; }
    }

    public class AppSettingsMtbl : IAppSettings
    {
        public AppSettingsMtbl()
        {
        }

        public AppSettingsMtbl(IAppSettings src)
        {
            DriveFolderCacheKeyName = src.DriveFolderCacheKeyName;
            RootDriveFolderCacheKeyName = src.RootDriveFolderCacheKeyName;
            ClientAppRootObjPropName = src.ClientAppRootObjPropName;
            CacheKeyBasePrefix = src.CacheKeyBasePrefix;
        }

        public string DriveFolderCacheKeyName { get; set; }
        public string RootDriveFolderCacheKeyName { get; set; }
        public string ClientAppRootObjPropName { get; set; }
        public string CacheKeyBasePrefix { get; set; }
    }
}
