import { ViewModelBase } from '../common/ViewModelBase.js';

export class AppSettings extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    driveFolderCacheKeyName =  null;
    rootDriveFolderCacheKeyName =  null;
    clientAppRootObjPropName =  null;
    cacheKeyBasePrefix =  null;
    driveFolderIdUrlQueryKey = null;
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

export class DriveItemOp extends DriveItem {
    constructor(src, throwOnUnknownProp = false) {
        super(src, throwOnUnknownProp);
        this.opUuid = null;
    }
    
    opUuid =  null;
    multipleItems =  null;
    nameMacro =  null;
}

export class DriveItemNameMacro extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super(src, throwOnUnknownProp);
        this.macroUuid = null;
    }

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
}