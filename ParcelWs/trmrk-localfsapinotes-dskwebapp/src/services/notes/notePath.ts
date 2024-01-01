import {
  isValidRootedFsPath,
  isValidFsPath,
  isValidRootedPath,
  isValidPath,
  PathValidationErrCode,
  PathValidationResult,
  dfPathValidationResult,
} from "trmrk/src/notes-path";

import { AppConfigData } from "trmrk/src/notes-app-config";

export const validateRootedPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = true
) => {
  const result = dfPathValidationResult();

  if (cfg.isLocalFileNotesApp) {
    isValidRootedFsPath(cfg, path, result, allowNetworkPath);
  } else {
    isValidRootedPath(cfg, path, result, allowNetworkPath);
  }

  const errMsg = getPathErrMsg(result);
  return errMsg;
};

export const validateRelPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = true
) => {
  const result = dfPathValidationResult();

  if (cfg.isLocalFileNotesApp) {
    isValidFsPath(cfg, path, result, allowNetworkPath);
  } else {
    isValidPath(cfg, path, result, allowNetworkPath);
  }

  const errMsg = getPathErrMsg(result);
  return errMsg;
};

export const getPathErrMsg = (result: PathValidationResult) => {
  let errMsg: string | null = null;

  if (!result.isValid) {
    switch (result.errCode) {
      case PathValidationErrCode.NullOrEmpty:
        errMsg = "File path must not be empty";
        break;
      case PathValidationErrCode.InvalidPathChars:
        if (result.invalidChar) {
          errMsg = `File path must not contain illegal tokens or sequences of tokens like:${result.invalidChar.value}`;
        }
        break;
      case PathValidationErrCode.IsNotRooted:
        errMsg = "File path must be rooted";
        break;
    }
  }

  return errMsg;
};
