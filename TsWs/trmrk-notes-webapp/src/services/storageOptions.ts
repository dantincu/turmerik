import trmrk from "trmrk";

import { ReadonlyArrayAdapter } from "trmrk/src/array-adapter";

import { TrmrkStorageOption, TrmrkNotesStorageOption } from "./appConfig";

export class TrmrkStorageOptionsReadonlyArrayAdapter extends ReadonlyArrayAdapter<TrmrkStorageOption> {
  constructor(
    array:
      | (TrmrkStorageOption | string)[]
      | readonly (TrmrkStorageOption | string)[]
  ) {
    super(array as TrmrkStorageOption[] | readonly TrmrkStorageOption[]);
  }
}

export class TrmrkStorageOptionMap {
  public readonly all: TrmrkStorageOptionsReadonlyArrayAdapter;
  public readonly noApi: ReadonlyArrayAdapter<TrmrkStorageOption>;
  public readonly api: ReadonlyArrayAdapter<TrmrkStorageOption>;
  public readonly cloudStorageApi: ReadonlyArrayAdapter<TrmrkStorageOption>;
  public readonly localFilesTrmrkRestApi: ReadonlyArrayAdapter<TrmrkStorageOption>;
  public readonly cloudStorageTrmrkRestApi: ReadonlyArrayAdapter<TrmrkStorageOption>;
  public readonly trmrkRestApi: ReadonlyArrayAdapter<TrmrkStorageOption>;

  constructor() {
    this.all = new TrmrkStorageOptionsReadonlyArrayAdapter(
      Object.values(TrmrkStorageOption)
    );

    this.noApi = new TrmrkStorageOptionsReadonlyArrayAdapter([
      TrmrkStorageOption.IndexedDB,
      TrmrkStorageOption.FileSystemApi,
    ]);

    this.api = new TrmrkStorageOptionsReadonlyArrayAdapter(
      this.all.except(this.noApi.array)
    );

    this.cloudStorageApi = new TrmrkStorageOptionsReadonlyArrayAdapter([
      TrmrkStorageOption.MsGraphApi,
      TrmrkStorageOption.GoogleApi,
      TrmrkStorageOption.DropBoxApi,
    ]);

    this.localFilesTrmrkRestApi = new TrmrkStorageOptionsReadonlyArrayAdapter([
      TrmrkStorageOption.LocalFilesTrmrkRestApi,
      TrmrkStorageOption.WinOSLocalFilesTrmrkRestApi,
    ]);

    this.cloudStorageTrmrkRestApi = new TrmrkStorageOptionsReadonlyArrayAdapter(
      [
        TrmrkStorageOption.MsGraphTrmrkRestApi,
        TrmrkStorageOption.GoogleTrmrkRestApi,
        TrmrkStorageOption.DropBoxTrmrkRestApi,
      ]
    );

    this.trmrkRestApi = new TrmrkStorageOptionsReadonlyArrayAdapter([
      ...this.localFilesTrmrkRestApi.array,
      ...this.cloudStorageTrmrkRestApi.array,
    ]);
  }
}

export const storageOptionsMap = new TrmrkStorageOptionMap();

export const normalizeStorageOptionsArr = (
  jsonArr: (Object | string | null | undefined)[],
  throwIfInvalid: boolean = true,
  filter?:
    | ((
        obj: TrmrkNotesStorageOption | null,
        idx: number,
        arr: (TrmrkNotesStorageOption | null)[]
      ) => boolean)
    | null
    | undefined
) =>
  jsonArr
    .map((obj) => normalizeStorageOption(obj, throwIfInvalid))
    .filter(filter ?? ((obj) => obj)) as TrmrkNotesStorageOption[];

export const normalizeStorageOption = (
  obj: Object | string | null | undefined,
  throwIfInvalid: boolean = true
) => {
  let retObj: TrmrkNotesStorageOption | null = null;

  const onInvalidCfgObj = () => {
    retObj = null;

    if (throwIfInvalid) {
      throw new Error("Invalid storage option config object");
    }
  };

  try {
    if (trmrk.isNonEmptyStr(obj)) {
      retObj = JSON.parse(obj as string);
    } else if (trmrk.isNotNullObj(obj)) {
      retObj = obj as TrmrkNotesStorageOption;
    }

    if (retObj && "number" === typeof retObj.storage) {
      if (
        (retObj.isTrmrkRestApi = storageOptionsMap.trmrkRestApi.contains(
          retObj.storage
        ))
      ) {
        retObj.isLocalFilesTrmrkRestApi =
          storageOptionsMap.localFilesTrmrkRestApi.contains(retObj.storage);

        retObj.isCloudStorageTrmrkRestApi = !retObj.isLocalFilesTrmrkRestApi;
        retObj.isApi = true;
      } else {
        retObj.isApi = retObj.isCloudStorageApi =
          storageOptionsMap.cloudStorageApi.contains(retObj.storage);
      }

      if (
        retObj.isTrmrkRestApi &&
        typeof retObj.trmrkRestApiHost !== "string"
      ) {
        onInvalidCfgObj();
      } else {
        retObj.isCloudStorage =
          retObj.isCloudStorageApi || retObj.isCloudStorageTrmrkRestApi;
      }
    } else {
      onInvalidCfgObj();
    }
  } catch (err) {
    onInvalidCfgObj();
  }

  return retObj;
};
