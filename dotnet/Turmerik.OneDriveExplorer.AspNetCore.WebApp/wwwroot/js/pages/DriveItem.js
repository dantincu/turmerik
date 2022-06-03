import { EntityBase } from '../common/EntityBase.js';

export class DriveItem extends EntityBase {
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