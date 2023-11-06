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
  docs = 1,
  sheets,
  slides,
}

export interface DriveItem {
  id: string | null | undefined;
  name: string;
  displayName: string | null | undefined;
  isFolder?: boolean | null | undefined;
  fileNameExtension?: string | null | undefined;
  fileType?: FileType | null | undefined;
  officeLikeFileType?: OfficeLikeFileType | null | undefined;
  isTextFile?: boolean | null | undefined;
  isImageFile?: boolean | null | undefined;
  isVideoFile?: boolean | null | undefined;
  isAudioFile?: boolean | null | undefined;
  webUrl?: string | null | undefined;
  parentId?: string | null | undefined;
}
