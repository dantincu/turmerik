using System.Collections.ObjectModel;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.AppConfig
{
    public interface IAppSettings
    {
        string DriveFolderCacheKeyName { get; }
        string RootDriveFolderCacheKeyName { get; }
        string ClientAppRootObjPropName { get; }
        string CacheKeyBasePrefix { get; }
        ReadOnlyCollection<string> AllDriveItemPropNames { get; }
        ReadOnlyCollection<string> ReqDriveItemPropNames { get; }
        ReadOnlyCollection<string> ReqDriveFolderPropNames { get; }
        ReadOnlyCollection<string> ReqDriveFilePropNames { get; }
    }

    public class AppSettingsImmtbl : IAppSettings
    {
        public AppSettingsImmtbl(IAppSettings src)
        {
            DriveFolderCacheKeyName = src.DriveFolderCacheKeyName;
            RootDriveFolderCacheKeyName = src.RootDriveFolderCacheKeyName;
            ClientAppRootObjPropName = src.ClientAppRootObjPropName;
            CacheKeyBasePrefix = src.CacheKeyBasePrefix;
            AllDriveItemPropNames = src.AllDriveItemPropNames;
            ReqDriveItemPropNames = src.ReqDriveItemPropNames;
            ReqDriveFolderPropNames = src.ReqDriveFolderPropNames;
            ReqDriveFilePropNames = src.ReqDriveFilePropNames;
        }

        public string DriveFolderCacheKeyName { get; }
        public string RootDriveFolderCacheKeyName { get; }
        public string ClientAppRootObjPropName { get; }
        public string CacheKeyBasePrefix { get; }
        public ReadOnlyCollection<string> AllDriveItemPropNames { get; }
        public ReadOnlyCollection<string> ReqDriveItemPropNames { get; }
        public ReadOnlyCollection<string> ReqDriveFolderPropNames { get; }
        public ReadOnlyCollection<string> ReqDriveFilePropNames { get; }
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
            AllDriveItemPropNames = src.AllDriveItemPropNames;
            ReqDriveItemPropNames = src.ReqDriveItemPropNames;
            ReqDriveFolderPropNames = src.ReqDriveFolderPropNames;
            ReqDriveFilePropNames = src.ReqDriveFilePropNames;
        }

        public string DriveFolderCacheKeyName { get; set; }
        public string RootDriveFolderCacheKeyName { get; set; }
        public string ClientAppRootObjPropName { get; set; }
        public string CacheKeyBasePrefix { get; set; }
        public ReadOnlyCollection<string> AllDriveItemPropNames { get; set; }
        public ReadOnlyCollection<string> ReqDriveItemPropNames { get; set; }
        public ReadOnlyCollection<string> ReqDriveFolderPropNames { get; set; }
        public ReadOnlyCollection<string> ReqDriveFilePropNames { get; set; }
    }
}
