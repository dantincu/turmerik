using System.Collections.ObjectModel;
using Turmerik.Core.DriveExplorer;

namespace Turmerik.OneDriveExplorer.AspNetCore.WebApp.AppConfig
{
    public interface IAppSettings
    {
        bool UseFsExplorerServiceEngine { get; }
        bool UseOneDriveExplorerServiceEngine { get; }
        string AppTitle { get; }
        string AppIconFileName { get; }
        string ApiFolderRelUri { get; }
        string ApiFileRelUri { get; }
        string ApiExplorerRelUri { get; }
        string DriveFolderCacheKeyName { get; }
        string RootDriveFolderCacheKeyName { get; }
        string DriveItemMacrosCacheKeyName { get; }
        string ClientAppRootObjPropName { get; }
        string CacheKeyBasePrefix { get; }
        string DriveFolderIdUrlQueryKey { get; }
        string GetDriveItemMacrosActionName { get; }
    }

    public class AppSettingsImmtbl : IAppSettings
    {
        public AppSettingsImmtbl(IAppSettings src)
        {
            UseFsExplorerServiceEngine = src.UseFsExplorerServiceEngine;
            UseOneDriveExplorerServiceEngine = src.UseOneDriveExplorerServiceEngine;
            AppTitle = src.AppTitle;
            AppIconFileName = src.AppIconFileName;
            ApiFolderRelUri = src.ApiFolderRelUri;
            ApiFileRelUri = src.ApiFileRelUri;
            ApiExplorerRelUri = src.ApiExplorerRelUri;
            DriveFolderCacheKeyName = src.DriveFolderCacheKeyName;
            RootDriveFolderCacheKeyName = src.RootDriveFolderCacheKeyName;
            DriveItemMacrosCacheKeyName = src.DriveItemMacrosCacheKeyName;
            ClientAppRootObjPropName = src.ClientAppRootObjPropName;
            CacheKeyBasePrefix = src.CacheKeyBasePrefix;
            DriveFolderIdUrlQueryKey = src.DriveFolderIdUrlQueryKey;
            GetDriveItemMacrosActionName = src.GetDriveItemMacrosActionName;
        }

        public bool UseFsExplorerServiceEngine { get; }
        public bool UseOneDriveExplorerServiceEngine { get; }
        public string AppTitle { get; }
        public string AppIconFileName { get; }
        public string ApiFolderRelUri { get; }
        public string ApiFileRelUri { get; }
        public string ApiExplorerRelUri { get; }
        public string DriveFolderCacheKeyName { get; }
        public string RootDriveFolderCacheKeyName { get; }
        public string DriveItemMacrosCacheKeyName { get; }
        public string ClientAppRootObjPropName { get; }
        public string CacheKeyBasePrefix { get; }
        public string DriveFolderIdUrlQueryKey { get; }
        public string GetDriveItemMacrosActionName { get; }
    }

    public class AppSettingsMtbl : IAppSettings
    {
        public AppSettingsMtbl()
        {
        }

        public AppSettingsMtbl(IAppSettings src)
        {
            UseFsExplorerServiceEngine = src.UseFsExplorerServiceEngine;
            UseOneDriveExplorerServiceEngine = src.UseOneDriveExplorerServiceEngine;
            AppTitle = src.AppTitle;
            AppIconFileName = src.AppIconFileName;
            ApiFolderRelUri = src.ApiFolderRelUri;
            ApiFileRelUri = src.ApiFileRelUri;
            ApiExplorerRelUri = src.ApiExplorerRelUri;
            DriveFolderCacheKeyName = src.DriveFolderCacheKeyName;
            RootDriveFolderCacheKeyName = src.RootDriveFolderCacheKeyName;
            DriveItemMacrosCacheKeyName = src.DriveItemMacrosCacheKeyName;
            ClientAppRootObjPropName = src.ClientAppRootObjPropName;
            CacheKeyBasePrefix = src.CacheKeyBasePrefix;
            DriveFolderIdUrlQueryKey = src.DriveFolderIdUrlQueryKey;
            GetDriveItemMacrosActionName = src.GetDriveItemMacrosActionName;
        }

        public bool UseFsExplorerServiceEngine { get; set; }
        public bool UseOneDriveExplorerServiceEngine { get; set; }
        public string AppTitle { get; set; }
        public string AppIconFileName { get; set; }
        public string ApiFolderRelUri { get; set; }
        public string ApiFileRelUri { get; set; }
        public string ApiExplorerRelUri { get; set; }
        public string DriveFolderCacheKeyName { get; set; }
        public string RootDriveFolderCacheKeyName { get; set; }
        public string DriveItemMacrosCacheKeyName { get; set; }
        public string ClientAppRootObjPropName { get; set; }
        public string CacheKeyBasePrefix { get; set; }
        public string DriveFolderIdUrlQueryKey { get; set; }
        public string GetDriveItemMacrosActionName { get; set; }
    }
}
