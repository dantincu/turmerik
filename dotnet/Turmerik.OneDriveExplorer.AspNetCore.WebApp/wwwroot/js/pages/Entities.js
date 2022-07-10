import { ViewModelBase } from '../common/ViewModelBase.js';

export class AppSettings extends ViewModelBase {
    driveFolderCacheKeyName =  null;
    rootDriveFolderCacheKeyName =  null;
    clientAppRootObjPropName =  null;
    cacheKeyBasePrefix =  null;
    driveFolderIdUrlQueryKey = null;

    constructor(src, throwOnUnknownProp) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }
}

export class DriveItem extends ViewModelBase {
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
    sizeBytesCount = null;
    subFolders = null;
    folderFiles = null;

    constructor(src, throwOnUnknownProp) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }
}

export class DriveItemOp extends DriveItem {
    opUuid =  null;
    multipleItems =  null;
    nameMacro =  null;

    constructor(src, throwOnUnknownProp = false) {
        super(null);
        this.__copyProps(src, throwOnUnknownProp);
        this.opUuid = null;
    }
}

export class DriveItemNameMacro extends ViewModelBase {
    macroUuid =  null;
    macroName =  null;
    macroDescription =  null;
    entryName =  null;
    srcName =  null;
    constName =  null;
    srcNameFirstLetterWrappingChar =  null;
    numberSeed =  null;
    minNumber =  null;
    maxNumber =  null;
    incrementNumber =  null;
    digitsCount =  null;
    preceedingDelimiter =  null;
    succeedingDelimiter =  null;
    succeedingMacro =  null;
    
    constructor(src, throwOnUnknownProp = false) {
        super(null);
        this.__copyProps(src, throwOnUnknownProp);
        this.macroUuid = null;
    }
}