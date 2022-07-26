export class AppSettings {
  apiFolderRelUri: string | null | undefined;
  apiFileRelUri: string | null | undefined;
  apiExplorerRelUri: string | null | undefined;
  driveFolderCacheKeyName: string | null | undefined;
  rootDriveFolderCacheKeyName: string | null | undefined;
  driveItemMacrosCacheKeyName: string | null | undefined;
  clientAppRootObjPropName: string | null | undefined;
  cacheKeyBasePrefix: string | null | undefined;
  driveFolderIdUrlQueryKey: string | null | undefined;
  getDriveItemMacrosActionName: string | null | undefined;
}

export enum OfficeLikeFileType {
  docs = 1,
  sheets = 2,
  slides = 3,
}

export class DriveItem {
  id: string | null | undefined;
  name: string | null | undefined;
  parentFolderId: string | null | undefined;
  isFolder: boolean | null | undefined;
  fileNameExtension: string | null | undefined;
  isRootFolder: boolean | null | undefined;
  creationTime: Date | null | undefined;
  lastAccessTime: Date | null | undefined;
  lastWriteTime: Date | null | undefined;
  creationTimeStr: string | null | undefined;
  lastAccessTimeStr: string | null | undefined;
  lastWriteTimeStr: string | null | undefined;
  officeLikeFileType: OfficeLikeFileType | null | undefined;
  isTextFile: boolean | null | undefined;
  isImageFile: boolean | null | undefined;
  isVideoFile: boolean | null | undefined;
  isAudioFile: boolean | null | undefined;
  textFileContent: string | null | undefined;
  sizeBytesCount: number | null | undefined;
  subFolders: DriveItem[] | null | undefined;
  folderFiles: DriveItem[] | null | undefined;
}

export class DriveItemOp extends DriveItem {
  opUuid: string | null | undefined;
  multipleItems: DriveItemOp[] | null | undefined;
  nameMacro: string | null | undefined;
}

export class DriveItemNameMacro {
  macroUuid: string | null | undefined;
  macroName: string | null | undefined;
  macroDescription: string | null | undefined;
  entryName: string | null | undefined;
  srcName: string | null | undefined;
  constName: string | null | undefined;
  srcNameFirstLetterWrappingChar: string | null | undefined;
  numberSeed: number | null | undefined;
  minNumber: number | null | undefined;
  maxNumber: number | null | undefined;
  incrementNumber: number | null | undefined;
  digitsCount: number | null | undefined;
  preceedingDelimiter: string | null | undefined;
  succeedingDelimiter: string | null | undefined;
  succeedingMacro: DriveItemNameMacro | null | undefined;
}

export class DriveItemMacro {
  key: string | null | undefined;
  name: string | null | undefined;
  nameMacro: DriveItemNameMacro | null | undefined;
  driveItemOp: DriveItemOp | null | undefined;
  multipleDriveItemOps: DriveItemOp[] | null | undefined;
  children: DriveItemMacro[] | null | undefined;
}
