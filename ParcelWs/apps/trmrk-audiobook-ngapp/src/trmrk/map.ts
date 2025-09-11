import { Kvp, NullOrUndef } from './core';

export const toMap = <TValue>(arr: Kvp<string, TValue>[]) => {
  const retMap: { [key: string]: TValue } = {};

  for (let kvp of arr) {
    retMap[kvp.key] = kvp.value;
  }

  return retMap;
};

export const getFromRecord = <K extends string | number | symbol, V, T>(
  record: Record<K, V>,
  key: K,
  selector: (value: V) => T,
  defaultSelector: (() => T | null) | NullOrUndef = null
) => {
  let retVal: T | null;
  const matching = record[key];

  if ((matching ?? null) !== null) {
    retVal = selector(matching);
  } else {
    defaultSelector ??= () => null;
    retVal = defaultSelector();
  }

  return retVal;
};

export const getFromMap = <V, T>(
  map: { [key: string]: V },
  key: string,
  selector: (value: V) => T,
  defaultSelector: (() => T | null) | NullOrUndef = null
) => {
  let retVal: T | null;
  const matching = map[key];

  if ((matching ?? null) !== null) {
    retVal = selector(matching);
  } else {
    defaultSelector ??= () => null;
    retVal = defaultSelector();
  }

  return retVal;
};
