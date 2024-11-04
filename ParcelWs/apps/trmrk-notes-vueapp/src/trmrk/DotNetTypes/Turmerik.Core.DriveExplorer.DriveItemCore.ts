import { SpecialFolder } from "./System.Environment.SpecialFolder";

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

export enum FolderType {
  Regular = 0,
  DriveRoot,
}

export interface DriveItemsRetriever {
  DirSeparator: string;
}

export interface DriveExplorerService extends DriveItemsRetriever {}

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
  SpecialFolderType: SpecialFolder | null;
  FileType: FileType | null;
  OfficeFileType: OfficeFileType | null;
  FolderType: FolderType | null;
  IsTextFile: boolean | null;
  IsImageFile: boolean | null;
  IsVideoFile: boolean | null;
  IsAudioFile: boolean | null;
  FileSizeBytes: number | null;
  TextFileContents: string | null;
  CreationTime: Date | null;
  LastWriteTime: Date | null;
  LastAccessTime: Date | null;
  CreationTimeStr: string | null;
  LastWriteTimeStr: string | null;
  LastAccessTimeStr: string | null;
  CreationTimeUtcTicks: number | null;
  LastWriteTimeUtcTicks: number | null;
  LastAccessTimeUtcTicks: number | null;
  CreationTimeUtcMillis: number | null;
  LastWriteTimeUtcMillis: number | null;
  LastAccessTimeUtcMillis: number | null;
}

export interface DriveItem<TDriveItem> extends DriveItemCore {
  SubFolders: TDriveItem[] | null;
  FolderFiles: TDriveItem[] | null;
}
