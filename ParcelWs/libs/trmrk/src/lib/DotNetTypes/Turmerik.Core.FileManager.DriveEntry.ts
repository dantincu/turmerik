export interface DriveEntryCore {
  Idnf: string | null;
  PrIdnf: string | null;
  Name: string | null;
  Path: string | null;
  FileSizeBytes: number | null;
  CreationTimeUtcTicks: number | null;
  LastWriteTimeUtcTicks: number | null;
  LastAccessTimeUtcTicks: number | null;
  CreationTimeUtcMillis: number | null;
  LastWriteTimeUtcMillis: number | null;
  LastAccessTimeUtcMillis: number | null;
}

export interface DriveEntry<TContent> extends DriveEntryCore {
  Content: TContent;
}

export interface DriveEntryX<TDriveEntry> extends DriveEntryCore {
  SubFolders: TDriveEntry[];
  FolderFiles: TDriveEntry[];
}

export interface FilesAndFoldersTuple<TDriveEntry> {
  Folders: TDriveEntry[];
  Files: TDriveEntry[];
}
