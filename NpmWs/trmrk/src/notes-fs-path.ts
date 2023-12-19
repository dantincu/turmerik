import { isNonEmptyStr, containsAnyOfMx, containsAnyOfArr } from "./core";

import { AppConfigData } from "./notes-app-config";

const createInvalidSeqncs = (sep: string, opSep: string) => [
  opSep,
  sep + sep,
  sep + " ",
  " " + sep,
  sep + ".",
  "." + sep,
];

const baseInvalidSeqncs = Object.freeze(["  ", " .", "..", ". "]);
const winInvalidSeqncs = Object.freeze(createInvalidSeqncs("\\", "/"));
const unixInvalidSeqncs = Object.freeze(createInvalidSeqncs("/", "\\"));

const getInvalidSeqncs = (isWinOs: boolean) =>
  isWinOs ? winInvalidSeqncs : unixInvalidSeqncs;

export const isValidRootedFsPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = false
) => {
  let isValid =
    !isNonEmptyStr(path) &&
    !containsAnyOfMx(path, [cfg.invalidFileNameChars, baseInvalidSeqncs]);

  if (isValid) {
    if (allowNetworkPath) {
      const dblSep = cfg.pathSep + cfg.pathSep;
      if (path.startsWith(dblSep)) {
        path = path.substring(1);
      }
    }

    if (cfg.isWinOS) {
      isValid = /^[a-zA-Z]\:/.test(path) || path.startsWith("\\");
    } else {
      isValid = path.startsWith("/");
    }

    const invalidSeqncs = getInvalidSeqncs(cfg.isWinOS);
    isValid = isValid && !containsAnyOfArr(path, invalidSeqncs);
  }

  return isValid;
};

export const isValidFsPath = (cfg: AppConfigData, path: string) => {
  if (path.startsWith("..")) {
    path = path.substring(2);
  } else if (path.startsWith(".")) {
    path = path.substring(1);
  }

  const isValid = isValidRootedFsPath(cfg, path);
  return isValid;
};
