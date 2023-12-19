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
const unixInvalidSeqncs = Object.freeze(createInvalidSeqncs("/", "\\"));

export const isValidRootedPath = (cfg: AppConfigData, path: string) => {
  let isValid =
    !isNonEmptyStr(path) &&
    !containsAnyOfMx(path, [cfg.invalidFileNameChars, baseInvalidSeqncs]);

  isValid = isValid && (path.startsWith("/") || path.startsWith("<~/"));
  isValid = isValid && !containsAnyOfArr(path, unixInvalidSeqncs);

  return isValid;
};

export const isValidPath = (cfg: AppConfigData, path: string) => {
  if (path.startsWith("..")) {
  } else if (path.startsWith(".")) {
    path = path.substring(1);
  }

  const isValid = isValidRootedPath(cfg, path);
  return isValid;
};
