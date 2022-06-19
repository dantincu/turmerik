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

    id = null;
    name = null;
    parentFolderId = null;
    isFolder = null;
    fileNameExtension = null;
    isRootFolder = null;
    creationTime = null;
    lastAccessTime = null;
    lastWriteTime = null;
    creationTimeStr = null;
    lastAccessTimeStr = null;
    lastWriteTimeStr = null;
    officeLikeFileType = null;
    textFileContent = null;
    subFolders = null;
    folderFiles = null;
}