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

export class DriveItemOp {
    Id =  null;
    Name =  null;
    ParentFolderId =  null;
    IsFolder =  null;
    FileNameExtension =  null;
    IsRootFolder =  null;
    CreationTime =  null;
    LastAccessTime =  null;
    LastWriteTime =  null;
    CreationTimeStr =  null;
    LastAccessTimeStr =  null;
    LastWriteTimeStr =  null;
    OfficeLikeFileType =  null;
    TextFileContent =  null;
    RawFileContent =  null;
    SubFolders =  null;
    FolderFiles =  null;
    OpUuid =  null;
    MultipleItems =  null;
    NameMacro =  null;
}

export class DriveItemNameMacro {
    MacroUuid =  null;
    MacroName =  null;
    MacroDescription =  null;
    EntryName =  null;
    SrcName =  null;
    ConstName =  null;
    SrcNameFirstLetterWrappingChar =  null;
    NumberSeed =  null;
    MinNumber =  null;
    MaxNumber =  null;
    IncrementNumber =  null;
    DigitsCount =  null;
    PreceedingDelimiter =  null;
    PreceedingMacro =  null;
    SucceedingDelimiter =  null;
    SucceedingMacro =  null;
}