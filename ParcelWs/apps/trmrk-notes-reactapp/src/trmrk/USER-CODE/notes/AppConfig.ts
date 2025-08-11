import { NullOrUndef } from '../../core';

export interface AppConfigDirNameTpl {
  DirNameTpl: string;
  MdFileNameTemplate: string;
}

export interface AppConfigDirNames {
  DefaultJoinStr: string;
  DirNamesTplMap: { [key: string]: AppConfigDirNameTpl };
}

export interface AppConfigFileNames {
  MdFileName: string;
  JsonFileName: string;
  MdFileNamePfx: string;
  PrependTitleToNoteMdFileName: boolean;
  KeepFileName: string;
}

export interface AppConfigFileContent {
  KeepFileContentsTemplate: string;
  KeepFileContainsNoteJson: boolean;
  MdFileContentsTemplate: string;
  MdFileContentSectionTemplate: string;
}

export interface AppConfigNoteDirNamePfxes {
  MainPfx: string;
  AltPfx: string;
  JoinStr: string;
  UseAltPfx: boolean;
}

export interface AppConfigNoteDirNameIdxes {
  MinIdx: number;
  MaxIdx: number;
  IncIdx: boolean;
  FillGapsByDefault: boolean;
}

export interface AppConfigNoteDirNames {
  NoteBook: string;
  NoteFiles: string;
  NoteInternals: string;
  NoteInternalsPfxes: AppConfigNoteDirNamePfxes;
  NoteItemsPfxes: AppConfigNoteDirNamePfxes;
  NoteSectionsPfxes: AppConfigNoteDirNamePfxes;
}

export interface AppConfigNoteFileNames {
  NoteBookJsonFileName: string;
  NoteItemJsonFileName: string;
  NoteItemMdFileName: string;
  NoteItemMdFileNamePfx: string;
  PrependTitleToNoteMdFileName: boolean;
  KeepFileName: string;
}

/* export interface AppConfigNoteFileContents {
  KeepFileContentsTemplate: string;
  KeepFileContainsNoteJson: boolean;
  NoteFileContentsTemplate: string;
  NoteFileContentSectionTemplate: string;
  ExpectTrmrkGuidInNoteJsonFile: boolean;
  ExpectTrmrkGuidInNoteMdFile: boolean;
} */

export interface AppConfigNoteDirPairs {
  DirNames: AppConfigNoteDirNames;
  NoteSectionDirNameIdxesMap: { [key: string]: AppConfigNoteDirNameIdxes };
  NoteDirNameIdxes: AppConfigNoteDirNameIdxes;
  NoteSectionDirNameIdxes: AppConfigNoteDirNameIdxes;
  NoteInternalDirNameIdxes: AppConfigNoteDirNameIdxes;
  FileNames: AppConfigNoteFileNames;
  // FileContents: AppConfigNoteFileContents;
}

export interface AppConfig {
  RequiredClientVersion: number;
  FileNameMaxLength: number;
  CreatePdfFile: boolean | NullOrUndef;
  DirNames: AppConfigDirNames;
  FileNames: AppConfigFileNames;
  FileContents: AppConfigFileContent;
  NoteDirPairs: AppConfigNoteDirPairs;
}
