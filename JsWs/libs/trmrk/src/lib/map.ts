import { Kvp, NullOrUndef } from "./core";
import { forEachProp } from "./obj";

export const toMap = <TValue>(arr: Kvp<string, TValue>[]) => {
  const retMap: { [key: string]: TValue } = {};

  for (let kvp of arr) {
    retMap[kvp.key] = kvp.value;
  }

  return retMap;
};

export const toNumMap = <TValue>(arr: Kvp<number, TValue>[]) => {
  const retMap: { [key: number]: TValue } = {};

  for (let kvp of arr) {
    retMap[kvp.key] = kvp.value;
  }

  return retMap;
};

export const getFromRecord = <K extends string | number | symbol, V, T>(
  record: Record<K, V>,
  key: K,
  selector: (value: V) => T,
  defaultSelector: (() => T | null) | NullOrUndef = null,
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
  defaultSelector: (() => T | null) | NullOrUndef = null,
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

export const mapStrMap = <TIn, TOut>(
  inMap: { [key: string]: TIn },
  convertor: (
    propVal: TIn,
    propName: string,
    objMap: { [key: string]: TIn },
    objPropNames: string[],
  ) => TOut,
) => {
  const outMap: { [key: string]: TOut } = {};

  forEachProp(inMap, (propVal, propName, objMap, objPropNames) => {
    outMap[propName] = convertor(propVal, propName, objMap, objPropNames);
  });

  return outMap;
};

export const mapNumMap = <TIn, TOut>(
  inMap: { [key: number]: TIn },
  convertor: (
    propVal: TIn,
    propKey: number,
    objMap: { [key: number]: TIn },
    objPropNames: string[],
    objPropKeys: number[],
  ) => TOut,
) => {
  const outMap: { [key: number]: TOut } = {};
  let objPropKeys: number[] | null = null;
  let i = 0;

  forEachProp(inMap, (propVal, propName, objMap, objPropNames) => {
    objPropKeys ??= objPropNames.map((propName) => parseInt(propName));
    const propKey = objPropKeys[i++];

    outMap[parseInt(propName)] = convertor(
      propVal,
      propKey,
      objMap,
      objPropNames,
      objPropKeys,
    );
  });

  return outMap;
};
