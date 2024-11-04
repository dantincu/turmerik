import { CmdCommand } from "./Turmerik.Notes.Core.CmdCommand";

export interface NoteDirsPairConfigMtbl {
  FileNameMaxLength: number | null;
  SerializeToJson: boolean | null;
  AllowGetRequestsToPersistChanges: boolean | null;
  TrmrkGuidInputName: string | null;
  ArgOpts: ArgOptionsAggT;
  DirNames: DirNamesT;
  NoteDirNameIdxes: DirNameIdxesT;
  NoteSectionDirNameIdxes: DirNameIdxesT;
  NoteInternalDirNameIdxes: DirNameIdxesT;
  FileNames: FileNamesT;
  FileContents: FileContentsT;
}

export interface ArgOptionT {
  Command: CmdCommand | null;
  FullArg: string;
  ShortArg: string;
  Description: string;
}

export interface ArgOptionsAggT {
  Help: ArgOptionT;
  SrcNote: ArgOptionT;
  SrcDirIdnf: ArgOptionT;
  SrcNoteIdx: ArgOptionT;
  DestnNote: ArgOptionT;
  DestnDirIdnf: ArgOptionT;
  DestnNoteIdx: ArgOptionT;
  NotesOrder: ArgOptionT;
  NoteIdxesOrder: ArgOptionT;
  IsSection: ArgOptionT;
  SortIdx: ArgOptionT;
  NoteIdx: ArgOptionT;
  OpenMdFile: ArgOptionT;
  ReorderNotes: ArgOptionT;
  CreateNoteFilesDirsPair: ArgOptionT;
  CreateNoteInternalDirsPair: ArgOptionT;
  CommandsMap: { [key: number | CmdCommand]: ArgOptionT };
}

export interface DirNamesT {
  NoteBook: string;
  NoteFiles: string;
  NoteInternals: string;
  NoteInternalsPfxes: DirNamePfxesT;
  NoteItemsPfxes: DirNamePfxesT;
  NoteSectionsPfxes: DirNamePfxesT;
}

export interface DirNamePfxesT {
  MainPfx: string;
  AltPfx: string;
  JoinStr: string;
  UseAltPfx: boolean | null;
}

export interface DirNameIdxesT {
  MinIdx: number | null;
  MaxIdx: number | null;
  IncIdx: boolean | null;
  FillGapsByDefault: boolean | null;
  IdxFmt: string | null;
}

export interface FileNamesT {
  NoteBookJsonFileName: string;
  NoteItemJsonFileName: string;
  NoteItemMdFileName: string;
  NoteItemMdFileNamePfx: string;
  PrependTitleToNoteMdFileName: boolean | null;
  KeepFileName: string;
}

export interface FileContentsT {
  KeepFileContentsTemplate: string;
  KeepFileContainsNoteJson: boolean | null;
  NoteFileContentsTemplate: string;
  NoteFileContentSectionTemplate: string;
  ExpectTrmrkGuidInNoteJsonFile: boolean | null;
  ExpectTrmrkGuidInNoteMdFile: boolean | null;
}
