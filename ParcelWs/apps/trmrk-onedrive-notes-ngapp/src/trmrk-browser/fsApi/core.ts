import { NullOrUndef } from '../../trmrk/core';

export interface FsApiEntry<THandle extends FileSystemHandle> {
  name: string;
  handle: THandle;
  isFolder: boolean | NullOrUndef;
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
