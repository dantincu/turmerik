export interface DirNamePfxes {
  MainPfx: string;
  AltPfx: string;
  JoinStr: string;
}

export interface DirNames {
  NoteBook: string;
  NoteFiles: string;
  NoteInternals: string;
  NoteInternalsPfxes: DirNamePfxes;
  NoteItemsPfxes: DirNamePfxes;
}

export interface DirNameIdxes {
  MinIdx: number;
  MaxIdx: number;
  IncIdx: boolean;
  FillGapsByDefault: boolean;
}

export interface FileNames {
  NoteBookJsonFileName: string;
  NoteItemJsonFileName: string;
  NoteItemMdFileName: string;
  PrependTitleToNoteMdFileName: boolean;
  KeepFileName: string;
}

export interface FileContents {
  KeepFileContentsTemplate: string;
  NoteFileContentsTemplate: string;
  NoteFileContentSectionTemplate: string;
  ExpectTrmrkGuidInNoteJsonFile: boolean;
  ExpectTrmrkGuidInNoteMdFile: boolean;
}

export interface NoteDirPairs {
  FileNameMaxLength: number;
  TrmrkGuidInputName: string;
  DirNames: DirNames;
  NoteDirNameIdxes: DirNameIdxes;
  NoteInternalDirNameIdxes: DirNameIdxes;
  FileNames: FileNames;
  FileContents: FileContents;
}

export enum TrmrkStorageOption {
  IndexedDB,
  FileSystemApi,
  MsGraphApi,
  GoogleApi,
  DropBoxApi,
  LocalFilesTrmrkRestApi,
  WinOSLocalFilesTrmrkRestApi,
  MsGraphTrmrkRestApi,
  GoogleTrmrkRestApi,
  DropBoxTrmrkRestApi,
}

export interface TrmrkNotesStorageOption {
  name: string;
  noteBookPath: string;
  storage: TrmrkStorageOption;
  isCloudStorage?: boolean | null | undefined;
  trmrkRestApiHost?: string | null | undefined;
  isApi?: boolean | null | undefined;
  isTrmrkRestApi?: boolean | null | undefined;
  isLocalFilesTrmrkRestApi?: boolean | null | undefined;
  isCloudStorageApi?: boolean | null | undefined;
  isCloudStorageTrmrkRestApi?: boolean | null | undefined;
}

export interface AppConfig {
  basePath: string | null | undefined;
  storageOptions: TrmrkNotesStorageOption[] | null | undefined;
  singleStorageOption?: TrmrkNotesStorageOption | null | undefined;
  NoteDirPairs: NoteDirPairs;
}

export class AppConfigRetriever {
  private _value: AppConfig | null;

  constructor() {
    this._value = null;
  }

  public get value() {
    if (!this._value) {
      throw new Error(
        "App config must first be initialized before it can be retrieved"
      );
    }

    return this._value;
  }

  public set value(value: AppConfig) {
    this._value = value;
  }
}

export const appCfg = new AppConfigRetriever();
