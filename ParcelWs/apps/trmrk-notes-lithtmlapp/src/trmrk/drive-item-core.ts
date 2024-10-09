export enum OfficeFileType {
  Word = 1,
  Excel,
  PowerPoint,
}

export enum FileType {
  PlainText = 1,
  Document,
  Image,
  Audio,
  Video,
  Code,
  Binary,
  ZippedFolder,
}

export interface DriveItemCore {
  Idnf: string;
  PrIdnf: string;
  CsId: string;
  PrCsId: string;
  PrPath: string;
  Name: string;
  DisplayName: string;
  IsFolder: boolean | null;
  IsRootFolder: boolean | null;
  IsSpecialFolder: boolean | null;
  FileType: FileType | null;
  OfficeFileType: OfficeFileType | null;
  IsTextFile: boolean | null;
  IsImageFile: boolean | null;
  IsVideoFile: boolean | null;
  IsAudioFile: boolean | null;
  FileSizeBytes: number | null;
  TextFileContents: string | null;
  CreationTime: string | null;
  LastWriteTime: string | null;
  LastAccessTime: string | null;
  CreationTimeUtcTicks: number | null;
  LastWriteTimeUtcTicks: number | null;
  LastAccessTimeUtcTicks: number | null;
}

export interface DriveItem<TDriveItem> extends DriveItemCore {
  SubFolders: TDriveItem[] | null;
  FolderFiles: TDriveItem[] | null;
}
