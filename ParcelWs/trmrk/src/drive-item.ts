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

export enum OfficeLikeFileType {
  word = 1,
  excel,
  powerPoint,
}

export interface DriveItem {
  idnf: string | null | undefined;
  name: string;
  displayName: string | null | undefined;
  isFolder?: boolean | null | undefined;
  isRootFolder?: boolean | null | undefined;
  prIdnf: string | null | undefined;
  fileType?: FileType | null | undefined;
  officeFileType?: OfficeLikeFileType | null | undefined;
  isTextFile?: boolean | null | undefined;
  isImageFile?: boolean | null | undefined;
  isVideoFile?: boolean | null | undefined;
  isAudioFile?: boolean | null | undefined;
}
