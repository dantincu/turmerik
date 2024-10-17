import { withValIf } from "./core";

import * as CmdCommandNs from "./DotNetTypes/Turmerik.Notes.Core.CmdCommand";
import * as NoteDirsPairConfig from "./DotNetTypes/Turmerik.Notes.Core.NoteDirsPairConfigMtbl";

export type CmdCommand = CmdCommandNs.CmdCommand;
export type ArgOptionT = NoteDirsPairConfig.ArgOptionT;
export type ArgOptionsAggT = NoteDirsPairConfig.ArgOptionsAggT;
export type DirNamePfxesT = NoteDirsPairConfig.DirNamePfxesT;
export type DirNamesT = NoteDirsPairConfig.DirNamesT;
export type DirNameIdxesT = NoteDirsPairConfig.DirNameIdxesT;
export type FileNamesT = NoteDirsPairConfig.FileNamesT;
export type FileContentsT = NoteDirsPairConfig.FileContentsT;
export type NoteDirPairsT = NoteDirsPairConfig.NoteDirsPairConfigMtbl;

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
  const cmdName = CmdCommandNs.CmdCommand[cmd];
  const cmdVal = commandsMap[cmdName];
  return cmdVal;
};

export const getCmd = (noteDirPairs: NoteDirPairsT, cmd: CmdCommand) =>
  getCommand(noteDirPairs.ArgOpts.CommandsMap, cmd);

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
