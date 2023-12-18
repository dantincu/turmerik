export enum CmdCommand {
  Help = 1,
  ListNotes,
  CreateNoteBook,
  CreateNoteBookInternal,
  CreateNote,
  CreateNoteInternal,
  CopyNotes,
  DeleteNotes,
  MoveNotes,
  RenameNote,
  UpdateNote,
  ReorderNotes,
  NormalizeNote,
  NormalizeNoteIdxes,
  NormalizeNotesHcy,
}

export interface ArgOptionT {
  fullArg: string;
  shortArg: string;
  description?: string | null | undefined;
}

export interface ArgOptionsAggT {
  help: ArgOptionT;
  listNotes: ArgOptionT;
  createNoteBook: ArgOptionT;
  createNoteBookInternal: ArgOptionT;
  createNote: ArgOptionT;
  createNoteInternal: ArgOptionT;
  copyNotes: ArgOptionT;
  deleteNotes: ArgOptionT;
  moveNotes: ArgOptionT;
  renameNote: ArgOptionT;
  updateNote: ArgOptionT;
  reorderNotes: ArgOptionT;
  normalizeNote: ArgOptionT;
  normalizeNoteIdxes: ArgOptionT;
  normalizeNotesHcy: ArgOptionT;

  commandsMap: { [key: string]: ArgOptionT };
}

export interface DirNamePfxesT {
  mainPfx: string;
  altPfx: string;
  joinStr: string;
  useAltPfx?: boolean | null | undefined;
}

export interface DirNamesT {
  noteBook: string;
  noteFiles: string;
  noteInternals: string;

  noteInternalsPfxes: DirNamePfxesT;
  NoteItemsPfxes: DirNamePfxesT;
}

export interface DirNameIdxesT {
  minIdx: number;
  maxIdx: number;
  incIdx: boolean;
  fillGapsByDefault: boolean;
  idxFmt: string;
}

export interface FileNamesT {
  noteBookJsonFileName: string;
  noteItemJsonFileName: string;
  noteItemMdFileName: string;
  prependTitleToNoteMdFileName: boolean;
  keepFileName: string;
}

export interface FileContentsT {}

export interface NoteDirPairsT {
  fileNameMaxLength: number;
  serializeToJson: boolean;
  allowGetRequestsToPersistChanges: boolean;
  trmrkGuidInputName?: string | null | undefined;
  argOpts: ArgOptionsAggT;
  dirNames: DirNamesT;
  noteDirNameIdxes: DirNameIdxesT;
  noteInternalDirNameIdxes: DirNameIdxesT;
  fileNames: FileNamesT;
  fileContents: FileContentsT;
}

export interface AppConfigData {
  trmrkPfx: string;
  isDevEnv: string;
  requiredClientVersion: string;
  noteDirPairs: NoteDirPairsT;
  invalidFileNameChars: string[];
  pathSep: string;
  altPathSep: string;
  isWinOS: boolean;
}

export const getCommand = (
  commandsMap: { [key: string]: ArgOptionT },
  cmd: CmdCommand
) => {
  const cmdName = CmdCommand[cmd];
  const cmdVal = commandsMap[cmdName];
  return cmdVal;
};

export const getCmd = (noteDirPairs: NoteDirPairsT, cmd: CmdCommand) =>
  getCommand(noteDirPairs.argOpts.commandsMap, cmd);
