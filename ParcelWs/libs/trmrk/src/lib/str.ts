import {
  allWsRegex,
  digitRegex,
  unicodeLetterRegex,
  letterRegex,
  NullOrUndef,
  UnifiedMap,
} from './core';

import { numIsBetween } from './math';

export const isNonEmptyStr = (
  arg: string | any,
  allWsSameAsEmpty = false,
  checkIsTypeOfString = true
) => {
  let retVal = !checkIsTypeOfString || 'string' === typeof arg;
  retVal = retVal && arg !== '';

  if (retVal && allWsSameAsEmpty) {
    retVal = !allWsRegex().test(arg);
  }

  return retVal;
};

export const isDigit = (char: string) => digitRegex().test(char);
export const isLetter = (char: string) => letterRegex().test(char);
export const isUnicodeLetter = (char: string) => unicodeLetterRegex().test(char);

export const isAsciiChar = (char: string, idx: number = 0) => char.charCodeAt(idx) <= 127;

export const isPrintableAsciiChar = (char: string, idx: number = 0) =>
  numIsBetween(char.charCodeAt(idx), 32, 126);

export const errToString = (error: Error | any, nullifyEmptyStr?: boolean | NullOrUndef) => {
  let errMsg: string | null = null;
  const errTypeOf = typeof error;

  if (errTypeOf === 'string') {
    errMsg = error;
  } else if (errTypeOf === 'object') {
    errMsg = error.message ?? error.cause;
  } else {
    errMsg = error?.toString();
  }

  errMsg ??= null;
  nullifyEmptyStr ??= true;

  if (nullifyEmptyStr && typeof errMsg === 'string' && errMsg.length === 0) {
    errMsg = null;
  }

  return errMsg;
};

export const subStr = (
  str: string,
  opts: {
    stIdx?: number | NullOrUndef;
    endIdx?: number | NullOrUndef;
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
        fullTrim?: boolean | NullOrUndef;
        trimStart?: boolean | NullOrUndef;
        trimEnd?: boolean | NullOrUndef;
      }
    | NullOrUndef
) => {
  trimOpts ??= {
    trimStr: ' ',
  };

  let trimStr = trimOpts.trimStr;

  if (!isNonEmptyStr(trimStr)) {
    trimStr = ' ';
  }

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

export const trimStartStr = (str: string, trimStrVal: string) =>
  trimStr(str, { trimStr: trimStrVal, trimStart: true });

export const trimEndStr = (str: string, trimStrVal: string) =>
  trimStr(str, { trimStr: trimStrVal, trimEnd: true });

export const trimFullStr = (str: string, trimStrVal: string) =>
  trimStr(str, { trimStr: trimStrVal, fullTrim: true });

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
) => [...inStr].map(convertor).join('');

export const extractDigits = (inStr: string, allowedNonDigits?: string[] | NullOrUndef) => {
  allowedNonDigits ??= ['.'];

  const outStr = transformStr(inStr, (chr) =>
    digitRegex().test(chr) || allowedNonDigits.indexOf(chr) >= 0 ? chr : null
  );

  return outStr;
};

export interface SerializeMapOpts<T> {
  startStr?: string | NullOrUndef;
  endStr?: string | NullOrUndef;
  keyValueJoinFactory: (key: string, value: T) => string;
  propsJoinFactory: (prop1: string, prop2: string) => string;
}

export const serializeMap = <T>(map: UnifiedMap<T>, opts: SerializeMapOpts<T>) => {
  const mapKeys = Object.keys(map);
  let retStr: string;

  if (mapKeys.length) {
    retStr = mapKeys
      .map((key) => opts.keyValueJoinFactory(key, (map as any)[key]))
      .reduce((prop1, prop2) => opts.propsJoinFactory(prop1, prop2));
  } else {
    retStr = '';
  }

  retStr = [opts.startStr ?? '', retStr, opts.endStr ?? ''].join('');
  return retStr;
};
