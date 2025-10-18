import { mapPropNamesToThemselves } from '../../../../trmrk/propNames';
import { CachedItemCore } from '../../../../trmrk-browser/indexedDB/core';
import { MtblRefValue, NullOrUndef, AnyOrUnknown } from '../../../../trmrk/core';
import { DriveEntryCore } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';
import { AppConfigCore } from '../../../../trmrk/app-config';

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

export interface StreamReaderReadResult {
  done: boolean;
  value: Uint8Array<ArrayBuffer> | NullOrUndef;
}

export type ContentFileCallback = (
  item: NamedItemCore,
  result: StreamReaderReadResult | null
) => Promise<AnyOrUnknown>;

export type FileContentFactory = (item: NamedItemCore) => Promise<FileSystemWriteChunkType>;

export const appSettingsChoiceKeys = Object.freeze(
  mapPropNamesToThemselves({
    driveStorageOption: '',
    current: '',
  })
);

export interface WriteFileContentToIndexDb<TIdnf> {
  fileContents: MtblRefValue<IDBObjectStore>;
  fileContentRefs: MtblRefValue<IDBObjectStore>;
  fileContentRefsIdxName: string;
  idnf: TIdnf;
  wkItemScIdx: MtblRefValue<number>;
  item: DriveEntryCore;
  callback: ContentFileCallback;
  readBytes: () => Promise<StreamReaderReadResult>;
  appConfig: AppConfigCore;
}

export const writeFileContentToIndexDb = async <TIdnf>(opts: WriteFileContentToIndexDb<TIdnf>) => {
  const index = await opts.fileContentRefs.value.index(opts.fileContentRefsIdxName);
  const keysArr = (await index.getAll([opts.idnf as IDBValidKey])).result as number[];

  for (let key in keysArr) {
    await opts.fileContentRefs.value.delete([key]);
  }

  const contentIntIdnf = (await opts.fileContentRefs!.value.put({
    Idnf: opts.idnf,
  } as FileContentRef<TIdnf>).result) as number;

  let isDone = false;
  opts.wkItemScIdx.value++;
  await opts.callback(opts.item, null);
  let chunkIdx = 0;
  let currentChunk = new Uint8Array();
  let currentChunkOffset = 0;

  while (!isDone) {
    let result = await opts.readBytes();
    isDone = result.done;
    const value = result.value;

    if (value) {
      currentChunk.set(value, currentChunkOffset);
      currentChunkOffset += value.length;

      if (currentChunkOffset >= opts.appConfig.blobChunkDefaultSize) {
        await opts.fileContents!.value.put({
          ContentIdnf: contentIntIdnf,
          Chunk: currentChunk,
          ChunkIdx: chunkIdx++,
        } as FileContent<TIdnf>);

        currentChunk = new Uint8Array();
        currentChunkOffset = 0;
      }
    }

    opts.wkItemScIdx!.value++;
    await opts.callback(opts.item, result);
  }

  if (currentChunkOffset > 0) {
    await opts.fileContents!.value.put({
      ContentIdnf: contentIntIdnf,
      Chunk: currentChunk,
      ChunkIdx: chunkIdx++,
    } as FileContent<TIdnf>);
  }
};
