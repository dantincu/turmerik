import { isNonEmptyStr, containsAnyOfMx, containsAnyOfArr } from "./core";

import { AppConfigData } from "./notes-app-config";

const createInvalidSeqncs = (sep: string, opSep: string) => [
  opSep,
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

export const isValidRootedFsPath = (cfg: AppConfigData, path: string) => {
  let isValid =
    !isNonEmptyStr(path) &&
    !containsAnyOfMx(path, [cfg.invalidFileNameChars, baseInvalidSeqncs]);

  if (isValid) {
    if (cfg.isWinOS) {
      isValid = isValid && (/^[a-zA-Z]\:/.test(path) || path.startsWith("\\"));
    } else {
      isValid = isValid && path.startsWith("/");
    }

    const invalidSeqncs = getInvalidSeqncs(cfg.isWinOS);
    isValid = isValid && !containsAnyOfArr(path, invalidSeqncs);
  }

  return isValid;
};

export const isValidFsPath = (cfg: AppConfigData, path: string) => {
  if (path.startsWith("..")) {
  } else if (path.startsWith(".")) {
    path = path.substring(1);
  }

  const isValid = isValidRootedFsPath(cfg, path);
  return isValid;
};
