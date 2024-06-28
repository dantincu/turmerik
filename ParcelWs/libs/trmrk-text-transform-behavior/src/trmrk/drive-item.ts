export enum FileType {
  plainText = 1,
  document,
  image,
  audio,
  video,
  code,
  binary,
  zippedFolder,
}

export enum OfficeFileType {
  word = 1,
  excel,
  powerPoint,
}

export interface DriveItemCore {
  idnf: string | null | undefined;
  prIdnf: string | null | undefined;
  csId: string | null | undefined;
  prCsId: string | null | undefined;
  prPath: string | null | undefined;

  name: string;
  displayName: string | null | undefined;

  isFolder?: boolean | null | undefined;
  isRootFolder?: boolean | null | undefined;

  fileType?: FileType | null | undefined;
  officeFileType?: OfficeFileType | null | undefined;
  isTextFile?: boolean | null | undefined;
  isImageFile?: boolean | null | undefined;
  isVideoFile?: boolean | null | undefined;
  isAudioFile?: boolean | null | undefined;
  fileSizeBytes?: number | null | undefined;
  textFileContents?: string | null | undefined;

  creationTime?: Date | null | undefined;
  lastWriteTime?: Date | null | undefined;
  lastAccessTime?: Date | null | undefined;

  creationTimeUtcTicks?: number | null | undefined;
  lastWriteTimeUtcTicks?: number | null | undefined;
  lastAccessTimeUtcTicks?: number | null | undefined;
}

export interface DriveItem extends DriveItemCore {
  subFolders: DriveItem[];
  folderFiles: DriveItem[];
}
