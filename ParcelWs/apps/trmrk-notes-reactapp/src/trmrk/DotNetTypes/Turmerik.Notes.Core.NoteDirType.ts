export enum NoteDirType {
  ShortName,
  FullName,
}

export enum NoteDirPfxType {
  Main,
  Alt,
}

export enum NoteDirCategory {
  Item,
  Section,
  Internals,
}

export enum NoteInternalDir {
  Root = 1,
  Internals,
  Files,
}

export interface NoteDirTypeTuple {
  DirCat: NoteDirCategory;
  DirType: NoteDirType;
  DirPfxType: NoteDirPfxType;
}

export interface NoteDirRegexTuple {
  Regex: RegExp;
  Prefix: string;
}

export interface NoteDirMatchTuple {
  DirName: string;
  ShortDirName: string;
  ShortDirNamePart: string | null;
  FullDirNamePart: string | null;
  NoteDirIdx: number;
  DirTypeTuple: NoteDirTypeTuple;
  DirRegexTuple: NoteDirRegexTuple;
  NoteInternalDir: NoteInternalDir | null;
}
