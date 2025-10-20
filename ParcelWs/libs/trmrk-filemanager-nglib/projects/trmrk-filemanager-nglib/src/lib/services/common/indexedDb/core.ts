import { timeoutToPromise } from '../../../../trmrk/timeout';
import { mapPropNamesToThemselves } from '../../../../trmrk/propNames';
import {
  CachedItemCore,
  sortCachedItems,
  dbRequestToPromise,
} from '../../../../trmrk-browser/indexedDB/core';
import { MtblRefValue, NullOrUndef, AnyOrUnknown } from '../../../../trmrk/core';
import { DriveEntryCore } from '../../../../trmrk/DotNetTypes/Turmerik.Core.FileManager.DriveEntry';
import { AppConfigCore } from '../../../../trmrk/app-config';
import { TrmrkBufferedObservable } from '../../../../trmrk-angular/services/common/TrmrkBufferedObservable';

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

export interface StreamReaderReadResult {
  done: boolean;
  value?: Uint8Array<ArrayBuffer> | NullOrUndef;
}

export type ContentFileCallback = (
  item: NamedItemCore,
  result: StreamReaderReadResult | null
) => Promise<AnyOrUnknown>;

export type FileContentFactory = (
  item: NamedItemCore
) => TrmrkBufferedObservable<StreamReaderReadResult>;

export const appSettingsChoiceKeys = Object.freeze(
  mapPropNamesToThemselves({
    driveStorageOption: '',
    current: '',
  })
);

export interface IndexedDbFileContentOptsCore<TIdnf> {
  fileContents: MtblRefValue<IDBObjectStore>;
  fileContentRefs: MtblRefValue<IDBObjectStore>;
  fileContentRefsIdxName: string;
  idnf: TIdnf;
  wkItemScIdx: MtblRefValue<number>;
  item: DriveEntryCore;
  appConfig: AppConfigCore;
  cacheContent: boolean;
}

export interface WriteFileContentToIndexedDb<TIdnf> extends IndexedDbFileContentOptsCore<TIdnf> {
  callback: ContentFileCallback;
  readBytes: () => Promise<StreamReaderReadResult>;
}

export interface WriteFileContentFromBuffObsToIndexedDb<TIdnf>
  extends IndexedDbFileContentOptsCore<TIdnf> {
  callback: FileContentFactory;
  readCallback: ContentFileCallback;
}

export interface ReadFileContentFromIndexedDbToBuffObsOpts<TIdnf>
  extends IndexedDbFileContentOptsCore<TIdnf> {
  fileContentChunkIdxName: string;
}

export const writeFileContentToIndexedDbIfReq = async <TIdnf>(
  opts: WriteFileContentToIndexedDb<TIdnf>
) => {
  const index = await opts.fileContentRefs.value.index(opts.fileContentRefsIdxName);

  const existingArr = (await dbRequestToPromise(index.getAll([opts.idnf as IDBValidKey])))
    .value as FileContentRef<TIdnf>[];

  for (let obj of existingArr) {
    await opts.fileContentRefs.value.delete([obj.ContentIdnf as IDBValidKey]);
  }

  const contentIntIdnf = (
    await dbRequestToPromise(
      opts.fileContentRefs!.value.put({
        Idnf: opts.idnf,
      } as FileContentRef<TIdnf>)
    )
  ).value as number;

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
      await opts.callback(opts.item, result);
      currentChunk.set(value, currentChunkOffset);
      currentChunkOffset += value.length;

      if (currentChunkOffset >= opts.appConfig.blobChunkDefaultSize) {
        if (opts.cacheContent) {
          await opts.fileContents!.value.put({
            ContentIdnf: contentIntIdnf,
            Chunk: currentChunk,
            ChunkIdx: chunkIdx++,
          } as FileContent<TIdnf>);
        }

        currentChunk = new Uint8Array();
        currentChunkOffset = 0;
      }
    }

    opts.wkItemScIdx!.value++;
  }

  if (currentChunkOffset > 0) {
    if (opts.cacheContent) {
      await opts.fileContents!.value.put({
        ContentIdnf: contentIntIdnf,
        Chunk: currentChunk,
        ChunkIdx: chunkIdx++,
      } as FileContent<TIdnf>);
    }
  }

  if (opts.cacheContent) {
    await opts.fileContentRefs!.value.put({
      Idnf: opts.idnf,
      ContentIdnf: contentIntIdnf,
      ChunksCount: chunkIdx,
    } as FileContentRef<TIdnf>);
  }
};

export const writeFileContentFromBuffObsToIndexedDbIfReq = async <TIdnf>(
  opts: WriteFileContentFromBuffObsToIndexedDb<TIdnf>
) => {
  const index = await opts.fileContentRefs.value.index(opts.fileContentRefsIdxName);

  const existingArr = (await dbRequestToPromise(index.getAll([opts.idnf as IDBValidKey])))
    .value as FileContentRef<TIdnf>[];

  for (let obj of existingArr) {
    await opts.fileContentRefs.value.delete([obj.ContentIdnf as IDBValidKey]);
  }

  const contentIntIdnf = (
    await dbRequestToPromise(
      opts.fileContentRefs!.value.put({
        Idnf: opts.idnf,
      } as FileContentRef<TIdnf>)
    )
  ).value as number;

  const obs = opts.callback(opts.item);
  const buffer = obs.buffer;
  let isDone = buffer.some((result) => result.done);

  if (!isDone) {
    const obsSubscription = obs.subscribe((result) => {
      isDone = result.done;

      if (isDone) {
        obsSubscription!.unsubscribe();
      }
    });
  }

  let chunkIdx = 0;
  let currentChunk = new Uint8Array();
  let currentChunkOffset = 0;

  while (!isDone || buffer.length) {
    if (buffer.length) {
      const chunk = buffer.splice(0, 1)[0];
      const value = chunk.value;

      if (value) {
        await opts.readCallback(opts.item, chunk);
        currentChunk.set(value, currentChunkOffset);
        currentChunkOffset += value.length;

        if (currentChunkOffset >= opts.appConfig.blobChunkDefaultSize) {
          if (opts.cacheContent) {
            await opts.fileContents!.value.put({
              ContentIdnf: contentIntIdnf,
              Chunk: currentChunk,
              ChunkIdx: chunkIdx++,
            } as FileContent<TIdnf>);
          }

          currentChunk = new Uint8Array();
          currentChunkOffset = 0;
        }

        opts.wkItemScIdx!.value++;
      }
    } else {
      await timeoutToPromise(100);
    }
  }

  if (currentChunkOffset > 0) {
    if (opts.cacheContent) {
      await opts.fileContents!.value.put({
        ContentIdnf: contentIntIdnf,
        Chunk: currentChunk,
        ChunkIdx: chunkIdx++,
      } as FileContent<TIdnf>);
    }
  }

  if (opts.cacheContent) {
    await opts.fileContentRefs!.value.put({
      Idnf: opts.idnf,
      ContentIdnf: contentIntIdnf,
      ChunksCount: chunkIdx,
    } as FileContentRef<TIdnf>);
  }
};

export const readFileContentFromIndexedDbToBuffObs = <TIdnf>(
  opts: ReadFileContentFromIndexedDbToBuffObsOpts<TIdnf>
): TrmrkBufferedObservable<StreamReaderReadResult> => {
  const obs = new TrmrkBufferedObservable<StreamReaderReadResult>([]);
  const index = opts.fileContentRefs.value.index(opts.fileContentRefsIdxName);

  dbRequestToPromise(index.getAll([opts.idnf as IDBValidKey])).then(async (result) => {
    const existing = result.value[0] as FileContentRef<TIdnf>;

    if (existing) {
      for (let i = 0; i < existing.ChunksCount; i++) {
        const dbChunk = (
          await dbRequestToPromise(
            opts.fileContents.value
              .index(opts.fileContentChunkIdxName)
              .get([existing.ContentIdnf as IDBValidKey, i])
          )
        ).value as FileContent<TIdnf>;

        obs.next({
          value: dbChunk.Chunk,
          done: false,
        });
      }
    } else {
      obs.next({
        done: true,
      });
    }
  });

  return obs;
};
