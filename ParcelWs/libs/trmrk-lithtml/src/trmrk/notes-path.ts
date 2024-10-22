import { Kvp, MtblRefValue } from "./core";
import { isNonEmptyStr } from "./str";

import { containsAnyOfMx } from "./arr";

import { AppConfigData } from "./notes-app-config";

export const trmrkPathSep = "/";
export const trmrkPathStartTkn = "<";

export const trmrkHomePathTkn = "~";
export const trmrkHomePathStr = [trmrkPathStartTkn, trmrkHomePathTkn].join("");
export const trmrkHomePathStartStr = [trmrkHomePathStr, trmrkPathSep].join("");

export const getPath = (
  pathParts: string[] | readonly string[],
  relToTrmrkHome: boolean | null | undefined = null
) => {
  const partsArr = [...pathParts];

  if (typeof relToTrmrkHome === "boolean") {
    if (isNonEmptyStr(partsArr[0])) {
      partsArr.splice(0, 0, "");
    }

    if (relToTrmrkHome === true) {
      partsArr[0] = trmrkHomePathStr;
    }
  }

  const path = partsArr.join(trmrkPathSep);
  return path;
};

export enum PathValidationErrCode {
  None = 0,
  NullOrEmpty,
  InvalidPathChars,
  IsNotRooted,
}

export interface PathValidationResult {
  isValid: boolean;
  errCode: PathValidationErrCode;
  invalidChar: Kvp<number, string | null | undefined>;
}

export const dfPathValidationResult = () =>
  ({
    isValid: false,
    errCode: PathValidationErrCode.None,
    invalidChar: {
      key: -1,
      value: null,
    },
  } as PathValidationResult);

export const createInvalidSeqncs = (sep: string, opSep: string) => [
  opSep,
  sep + sep,
  sep + " ",
  " " + sep,
  sep + ".",
  "." + sep,
];

export const baseInvalidSeqncs = Object.freeze(["  ", " .", "..", ". "]);
export const winInvalidSeqncs = Object.freeze(createInvalidSeqncs("\\", "/"));
export const unixInvalidSeqncs = Object.freeze(createInvalidSeqncs("/", "\\"));

export const getInvalidSeqncs = (isWinOs: boolean) =>
  isWinOs ? winInvalidSeqncs : unixInvalidSeqncs;

export const normalizeIfNetworkPath = (
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

export const normalizeIfRelPath = (path: string, sep: string) => {
  if (path.startsWith(".." + sep)) {
    path = path.substring(2);
  } else if (path.startsWith("." + sep)) {
    path = path.substring(1);
  }

  return path;
};

export const checkPathNotContainsInvalidChars = (
  path: string,
  result: PathValidationResult,
  invalidStrMx: (string[] | readonly string[])[]
) => {
  let matching = {} as MtblRefValue<
    Kvp<number, Kvp<number, string | null | undefined>>
  >;

  if (!(result.isValid = !containsAnyOfMx(path, invalidStrMx, matching))) {
    result.errCode = PathValidationErrCode.InvalidPathChars;
    result.invalidChar = matching.value.value;
  }

  return result.isValid;
};

export const isValidRootedPathCore = (
  cfg: AppConfigData,
  path: string,
  result: PathValidationResult
) => {
  if (!(result.isValid = isNonEmptyStr(path, true))) {
    result.errCode = PathValidationErrCode.NullOrEmpty;
  } else {
    checkPathNotContainsInvalidChars(path, result, [
      cfg.invalidFileNameChars,
      baseInvalidSeqncs,
    ]);
  }

  return result.isValid;
};

export const isValidRootedPath = (
  cfg: AppConfigData,
  path: string,
  result: PathValidationResult | null | undefined = null,
  allowNetworkPath: boolean = true
) => {
  result ??= dfPathValidationResult();
  result.isValid = isValidRootedPathCore(cfg, path, result);

  if (result.isValid) {
    path = normalizeIfNetworkPath(path, cfg.pathSep, allowNetworkPath);

    if (
      !(result.isValid =
        path.startsWith("/") || path.startsWith(trmrkHomePathStartStr))
    ) {
      result.errCode = PathValidationErrCode.IsNotRooted;
    }
  }

  if (result.isValid) {
    checkPathNotContainsInvalidChars(path, result, [unixInvalidSeqncs]);
  }

  return result.isValid;
};

export const isValidRootedFsPath = (
  cfg: AppConfigData,
  path: string,
  result: PathValidationResult | null | undefined = null,
  allowNetworkPath: boolean = true
) => {
  result ??= dfPathValidationResult();

  if (cfg.isWinOS) {
    if ((result.isValid = /^[a-zA-Z]\:/.test(path))) {
      path = path.substring(2);
    } else {
      result.isValid = path.startsWith("\\");
    }
  } else {
    result.isValid = path.startsWith("/");
  }

  if (result.isValid) {
    path = normalizeIfNetworkPath(path, cfg.pathSep, allowNetworkPath);

    result.isValid = checkPathNotContainsInvalidChars(path, result, [
      cfg.invalidFileNameChars,
      baseInvalidSeqncs,
    ]);
  } else {
    result.errCode = PathValidationErrCode.IsNotRooted;
  }

  result.isValid =
    result.isValid &&
    checkPathNotContainsInvalidChars(path, result, [
      getInvalidSeqncs(cfg.isWinOS),
    ]);

  return result.isValid;
};

export const isValidPath = (
  cfg: AppConfigData,
  path: string,
  result: PathValidationResult | null | undefined = null,
  allowNetworkPath: boolean = true
) => {
  result ??= dfPathValidationResult();
  path = normalizeIfRelPath(path, cfg.pathSep);

  result.isValid = isValidRootedPath(cfg, path, result, allowNetworkPath);
  return result.isValid;
};

export const isValidFsPath = (
  cfg: AppConfigData,
  path: string,
  result: PathValidationResult | null | undefined = null,
  allowNetworkPath: boolean = true
) => {
  result ??= dfPathValidationResult();
  path = normalizeIfRelPath(path, cfg.pathSep);

  result.isValid = isValidRootedFsPath(cfg, path, result, allowNetworkPath);
  return result.isValid;
};

export const getFileNameExtension = (fileName: string) => {
  let extension: string;
  const fileNameParts = fileName.split(".");

  if (fileNameParts.length > 1) {
    extension = fileNameParts.pop()!;
    extension = `.${extension}`;
  } else {
    extension = "";
  }

  return extension;
};

export const getFileNameExtnWithoutLeadingDot = (fileName: string) => {
  let fileNameExtn: string | null = getFileNameExtension(fileName);

  if (fileNameExtn !== "") {
    fileNameExtn = fileNameExtn.substring(1);
  } else {
    fileNameExtn = null;
  }

  return fileNameExtn;
};
