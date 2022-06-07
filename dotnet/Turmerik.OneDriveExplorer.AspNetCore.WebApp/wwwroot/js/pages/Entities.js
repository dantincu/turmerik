import { ViewModelBase } from '../common/ViewModelBase.js';

export class AppSettings extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    DriveFolderCacheKeyName =  null;
    RootDriveFolderCacheKeyName =  null;
    ClientAppRootObjPropName =  null;
    CacheKeyBasePrefix =  null;
    DriveFolderIdUrlQueryKey = null;
}

export class DriveItem extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    Id = null;
    Name = null;
    ParentFolderId = null;
    IsFolder = null;
    FileNameExtension = null;
    IsRootFolder = null;
    CreationTime = null;
    LastAccessTime = null;
    LastWriteTime = null;
    CreationTimeStr = null;
    LastAccessTimeStr = null;
    LastWriteTimeStr = null;
    OfficeLikeFileType = null;
    SubFolders = null;
    FolderFiles = null;
}