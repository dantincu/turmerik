import { core as trmrk } from "trmrk";

export interface FsApiEntry<THandle extends FileSystemHandle> {
  name: string;
  handle: THandle;
  isFolder: boolean | null | undefined;
}

export interface FsApiFile extends FsApiEntry<FileSystemFileHandle> {}

export interface FsApiFolder extends FsApiEntry<FileSystemDirectoryHandle> {
  subFolders: FsApiFolder[];
  folderFiles: FsApiFile[];
}

export interface SrcTrgPair<T> {
  src: T;
  trg: T;
}
