import { core as trmrk } from "trmrk";

export interface FsApiFolder {
  folderHandle: FileSystemDirectoryHandle;
  subFolders: FsApiFolder[];
  folderFiles: FileSystemFileHandle[];
}

export interface SrcTrgPair<T> {
  src: T;
  trg: T;
}
