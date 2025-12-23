import {
  allWsRegex,
  digitRegex,
  unicodeLetterRegex,
  letterRegex,
  NullOrUndef,
  UnifiedMap,
  StrMap,
  Kvp,
  AnyOrUnknown,
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
        trimStr: string | string[];
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

  if ((trimStr ?? '') === '') {
    trimStr = ' ';
  }

  if ('string' === typeof trimStr) {
    trimStr = [trimStr];
  }

  if (trimOpts.fullTrim || trimOpts.trimStart) {
    let idx = trimStr.findIndex((s) => str.startsWith(s));

    while (idx >= 0) {
      str = str.substring(trimStr[idx].length);
      idx = trimStr.findIndex((s) => str.startsWith(s));
    }
  }

  if (trimOpts.fullTrim || trimOpts.trimEnd) {
    let idx = trimStr.findIndex((s) => str.endsWith(s));

    while (idx >= 0) {
      str = str.substring(0, str.length - trimStr[idx].length);
      idx = trimStr.findIndex((s) => str.endsWith(s));
    }
  }

  return str;
};

export const trimStartStr = (str: string, trimStrVal: string) =>
  trimStr(str, { trimStr: trimStrVal, trimStart: true });

export const trimEndStr = (str: string, trimStrVal: string) =>
  trimStr(str, { trimStr: trimStrVal, trimEnd: true });

export const trimFullStr = (str: string, trimStrVal: string | string[]) =>
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

export interface SplitStrItem {
  part: string;
  delim: string | null;
  isLast?: boolean | NullOrUndef;
}

export const splitStr = (str: string, delimsArr: string[]) => {
  const retArr: SplitStrItem[] = [];

  const getMatchingDelims = () =>
    delimsArr
      .map((delim) => ({
        delim,
        idx: str.indexOf(delim),
      }))
      .filter((match) => match.idx >= 0)
      .sort((a, b) => (a.idx <= b.idx ? -1 : 1));

  let matchingDelims = getMatchingDelims();

  while (matchingDelims.length) {
    while (matchingDelims.length) {
      const firstMatch = matchingDelims.splice(0, 1)[0];

      retArr.push({
        part: str.substring(0, firstMatch.idx),
        delim: firstMatch.delim,
      });

      str = str.substring(firstMatch.idx + firstMatch.delim.length);

      matchingDelims.forEach((delim) => {
        delim.idx -= firstMatch.idx + firstMatch.delim.length;
      });

      matchingDelims = matchingDelims.filter((match) => match.idx >= 0);
    }

    matchingDelims = getMatchingDelims();
  }

  retArr.push({
    part: str,
    delim: null,
    isLast: true,
  });

  return retArr;
};

export const tryDigest = <T = any>(
  inputStr: string,
  predicate: (char: string, idx: number) => number,
  callback: (newStr: string, strIdx: number, newStrStartIdx: number) => T,
  sliceAfter = true,
  startPosition = 0
) => {
  let strLen = 0;

  const strIdx = [...inputStr]
    .slice(startPosition)
    .findIndex((char, idx) => (strLen = predicate(char, idx)) >= 0);
    
  let newStr: string;
  let newStrStartIdx: number;

  if (strIdx >= 0) {
    if (sliceAfter) {
      newStrStartIdx = strIdx + strLen;
      newStr = inputStr.substring(newStrStartIdx);
    } else {
      newStrStartIdx = 0;
      newStr = inputStr.substring(0, strIdx);
    }
  } else {
    newStrStartIdx = 0;
    newStr = inputStr;
  }

  const retVal = callback(newStr, strIdx, newStrStartIdx);
  return retVal;
};

export const tryDigestStr = <T = any>(
  inputStr: string,
  str: string,
  callback: (newStr: string, strIdx: number, newStrStartIdx: number) => T,
  sliceAfter = true,
  startPosition = 0
) =>
  tryDigest(
    inputStr,
    (_, idx) => (inputStr.startsWith(str, idx) ? str.length : -1),
    callback,
    sliceAfter,
    startPosition
  );
