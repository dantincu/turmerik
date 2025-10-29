import { CachedItemCore } from '../../../../trmrk-browser/indexedDB/core';

export interface NamedItemCore {
  Idnf: string | null;
  Name: string | null;
}

export interface ItemCore<TIdnf> extends CachedItemCore {
  Idnf: TIdnf;
}

export interface Item<TIdnf> extends ItemCore<TIdnf> {
  Name: string;
  PrIdnf: TIdnf;
}

export interface DirChildrenIdnfs<TIdnf> extends ItemCore<TIdnf> {
  folderFileIdnfs: TIdnf[];
  subFolderIdnfs: TIdnf[];
}

export interface ItemFileSize<TIdnf> extends ItemCore<TIdnf> {
  FileSizeBytes: number;
}

export interface ItemTimeStamps<TIdnf> extends ItemCore<TIdnf> {
  CreationTimeUtcMillis: number | null;
  LastWriteTimeUtcMillis: number | null;
  LastAccessTimeUtcMillis: number | null;
}

export interface TextFileContent<TIdnf> extends ItemCore<TIdnf> {
  Content: string;
}

export interface FileContentRef<TIdnf> extends ItemCore<TIdnf> {
  ContentIdnf: TIdnf;
  ChunksCount: number;
}

export interface FileContent<TIdnf> {
  ContentIdnf: TIdnf;
  Chunk: Uint8Array<ArrayBuffer>;
  ChunkIdx: number;
}

export interface IntIdnfItemCore extends ItemCore<number> {}

export interface StrIdnfItemCore extends ItemCore<string> {}

export interface IntIdnfItem extends Item<number> {}

export interface StrIdnfItem extends Item<string> {}

export interface IntIdnfDirChildrenIdnfs extends DirChildrenIdnfs<number> {}

export interface StrIdnfDirChildrenIdnfs extends DirChildrenIdnfs<string> {}

export interface IntIdnfItemFileSize extends ItemFileSize<number> {}

export interface StrIdnfItemFileSize extends ItemFileSize<string> {}

export interface IntIdnfItemTimeStamps extends ItemTimeStamps<number> {}

export interface StrIdnfItemTimeStamps extends ItemTimeStamps<string> {}

export interface IntIdnfTextFileContent extends TextFileContent<number> {}

export interface StrIdnfTextFileContent extends TextFileContent<string> {}

export interface IntIdnfFileContentRef extends FileContentRef<number> {}

export interface StrIdnfFileContentRef extends FileContentRef<string> {}

export interface IntIdnfFileContent extends FileContent<number> {}

export interface StrIdnfFileContent extends FileContent<string> {}
