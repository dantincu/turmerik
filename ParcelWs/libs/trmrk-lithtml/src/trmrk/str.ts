import { allWsRegex, digitRegex } from "./core";

export const isNonEmptyStr = (arg: string | any, allWsSameAsEmpty = false) => {
  let retVal = "string" === typeof arg;
  retVal = retVal && arg !== "";

  if (retVal && allWsSameAsEmpty) {
    retVal = !allWsRegex().test(arg);
  }

  return retVal;
};

export const errToString = (
  error: Error | any,
  nullifyEmptyStr?: boolean | null | undefined
) => {
  let errMsg: string | null = null;
  const errTypeOf = typeof error;

  if (errTypeOf === "string") {
    errMsg = error;
  } else if (errTypeOf === "object") {
    errMsg = error.message ?? error.cause;
  } else {
    errMsg = error?.toString();
  }

  errMsg ??= null;
  nullifyEmptyStr ??= true;

  if (nullifyEmptyStr && typeof errMsg === "string" && errMsg.length === 0) {
    errMsg = null;
  }

  return errMsg;
};

export const subStr = (
  str: string,
  opts: {
    stIdx?: number | null | undefined;
    endIdx?: number | null | undefined;
  }
) => {
  opts ??= {};
  const stIdx = opts.stIdx ?? 0;
  let endIdx = opts.endIdx ?? -1;

  if (endIdx < 0) {
    endIdx = str.length + endIdx + 1 - stIdx;
  }

  const retStr = str.substring(stIdx, endIdx);
  return retStr;
};

export const trimStr = (
  str: string,
  trimOpts?:
    | {
        trimStr: string;
        fullTrim?: boolean | null | undefined;
        trimStart?: boolean | null | undefined;
        trimEnd?: boolean | null | undefined;
      }
    | null
    | undefined
) => {
  trimOpts ??= {
    trimStr: " ",
  };

  let trimStr = trimOpts.trimStr;

  if (!isNonEmptyStr(trimStr)) {
    trimStr = " ";
  }

  trimStr.length;

  if (trimOpts.fullTrim || trimOpts.trimStart) {
    while (str.startsWith(trimStr)) {
      str = str.substring(trimStr.length);
    }
  }

  if (trimOpts.fullTrim || trimOpts.trimEnd) {
    while (str.endsWith(trimStr)) {
      str = str.substring(0, str.length - trimStr.length);
    }
  }

  return str;
};

export const capitalizeFirstLetter = (str: string) => {
  let firstLetter = str[0];

  if (firstLetter) {
    const cappFirstLetter = firstLetter.toUpperCase();

    if (firstLetter !== cappFirstLetter) {
      str = cappFirstLetter + str.substring(1);
    }
  }

  return str;
};

export const transformStr = (
  inStr: string,
  convertor: (chr: string, idx: number) => string | null
) => [...inStr].map(convertor).join("");

export const extractDigits = (
  inStr: string,
  allowedNonDigits?: string[] | null | undefined
) => {
  allowedNonDigits ??= ["."];

  const outStr = transformStr(inStr, (chr) =>
    digitRegex().test(chr) || allowedNonDigits.indexOf(chr) >= 0 ? chr : null
  );

  return outStr;
};
