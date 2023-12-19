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

const normalizeIfNetworkPath = (
  path: string,
  sep: string,
  allowNetworkPath: boolean
) => {
  if (allowNetworkPath) {
    const dblSep = sep + sep;

    if (path.startsWith(dblSep)) {
      path = path.substring(1);
    }
  }

  return path;
};

const normalizeIfRelPath = (path: string, sep: string) => {
  if (path.startsWith(".." + sep)) {
    path = path.substring(2);
  } else if (path.startsWith("." + sep)) {
    path = path.substring(1);
  }

  return path;
};

const isValidRootedPathCore = (cfg: AppConfigData, path: string) =>
  !isNonEmptyStr(path) &&
  !containsAnyOfMx(path, [cfg.invalidFileNameChars, baseInvalidSeqncs]);

export const isValidRootedPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = false
) => {
  let isValid = isValidRootedPathCore(cfg, path);

  if (isValid) {
    path = normalizeIfNetworkPath(path, cfg.pathSep, allowNetworkPath);

    isValid = path.startsWith("/") || path.startsWith("<~/");
    isValid = isValid && !containsAnyOfArr(path, unixInvalidSeqncs);
  }

  return isValid;
};

export const isValidRootedFsPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = false
) => {
  let isValid = isValidRootedPathCore(cfg, path);

  if (isValid) {
    path = normalizeIfNetworkPath(path, cfg.pathSep, allowNetworkPath);

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

export const isValidPath = (cfg: AppConfigData, path: string) => {
  path = normalizeIfRelPath(path, cfg.pathSep);
  const isValid = isValidRootedPath(cfg, path);

  return isValid;
};

export const isValidFsPath = (cfg: AppConfigData, path: string) => {
  path = normalizeIfRelPath(path, cfg.pathSep);
  const isValid = isValidRootedFsPath(cfg, path);

  return isValid;
};
