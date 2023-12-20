import {
  isValidRootedFsPath,
  isValidFsPath,
  PathValidationErrCode,
  PathValidationResult,
  dfPathValidationResult,
} from "trmrk/src/notes-path";

import { AppConfigData } from "trmrk/src/notes-app-config";

export const validateRootedFsPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = true
) => {
  const result = dfPathValidationResult();
  isValidRootedFsPath(cfg, path, result, allowNetworkPath);

  const errMsg = getPathErrMsg(result);
  return errMsg;
};

export const validateRelFsPath = (
  cfg: AppConfigData,
  path: string,
  allowNetworkPath: boolean = true
) => {
  const result = dfPathValidationResult();
  isValidFsPath(cfg, path, result, allowNetworkPath);

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
