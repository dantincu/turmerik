import { withVal, withValIf } from "./core";

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
  apiHost: string;
  trmrkPfx: string;
  isDevEnv: string;
  clientVersion: string;
  requiredClientVersion: string;
  noteDirPairs: NoteDirPairsT;
  invalidFileNameChars: string[];
  pathSep: string;
  altPathSep: string;
  isWinOS: boolean;
  isLocalFileNotesApp: boolean;
  clientUserUuid: string;
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

export interface WithNodeEnvOpts<T> {
  onDevelopment: (nodeEnv: string, nodeEnvObj: NodeJS.ProcessEnv) => T;
  onProduction: (nodeEnv: string, nodeEnvObj: NodeJS.ProcessEnv) => T;
  onInvalidValue?: (
    nodeEnv: string | undefined,
    nodeEnvObj: NodeJS.ProcessEnv
  ) => T;
  devEnvName?: string | null | undefined;
  prodEnvName?: string | null | undefined;
  nodeEnvName?: string | null | undefined;
}

export const withRequiredNodeVar = <T>(
  varName: string,
  convertor: (value: string, nodeEnvObj: NodeJS.ProcessEnv) => T,
  onNotFound?: ((nodeEnvObj: NodeJS.ProcessEnv) => T) | null | undefined
) =>
  withValIf(
    process.env[varName],
    (val) => convertor(val!, process.env),
    () => {
      if (onNotFound) {
        return onNotFound(process.env);
      } else {
        throw new Error(`No value found for process.env.${varName}`);
      }
    }
  );

export const withNodeEnv = <T>(opts: WithNodeEnvOpts<T>) =>
  withRequiredNodeVar(
    opts.nodeEnvName ?? "NODE_ENV",
    (value) => {
      let retVal: T;

      switch (value) {
        case opts.devEnvName ?? "development":
          retVal = opts.onDevelopment(value, process.env);
          break;
        case opts.prodEnvName ?? "production":
          retVal = opts.onProduction(value, process.env);
          break;
        default:
          throw new Error(
            `Invalid value found for process.env.${opts.nodeEnvName} (${
              value!.length ?? 0
            } characters lenght): ${value}`
          );
      }

      return retVal;
    },
    withValIf(
      opts.onInvalidValue,
      (onInvalidValue) => (nodeEnvObj: NodeJS.ProcessEnv) =>
        onInvalidValue!(undefined, nodeEnvObj),
      () => null
    )
  );
