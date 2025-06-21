import { Kvp, MtblRefValue, ValueOrAny } from './core';

export const toArray = <T>(itrbl: Iterable<T>) => {
  const retArr: T[] = [];

  for (let val of itrbl) {
    retArr.push(val);
  }

  return retArr;
};

export const findKvp = <TValue>(
  arr: TValue[] | readonly TValue[],
  predicate: (
    value: TValue,
    idx: number,
    array: TValue[] | readonly TValue[]
  ) => boolean
) => {
  let retIdx = -1;
  let retVal: TValue | null = null;

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];

    if (predicate(val, i, arr)) {
      retIdx = i;
      retVal = val;
      break;
    }
  }

  const retKvp: Kvp<number, TValue | null> = {
    key: retIdx,
    value: retVal,
  };

  return retKvp;
};

export const forEach = <T>(
  arr: T[],
  callback: (item: T, idx: number, arr: T[]) => boolean | void
) => {
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr) === false) {
      break;
    }
  }
};

export const contains = <T>(arr: T[], item: T) => arr.indexOf(item) >= 0;

export const any = <T>(
  arr: T[],
  predicate: (item: T, idx: number, array: T[]) => boolean
) => arr.filter(predicate).length >= 0;

export const containsAnyOfArr = (
  inStr: string,
  strArr: string[] | readonly string[],
  matching?:
    | MtblRefValue<Kvp<number, string | null | undefined>>
    | null
    | undefined
) => {
  matching ??= {
    value: {
      key: -1,
      value: null,
    },
  };

  const kvp = findKvp(strArr, (chr) => inStr.indexOf(chr) >= 0);
  const retVal = kvp.key >= 0;

  if (retVal) {
    matching.value = kvp;
  }

  return retVal;
};

export const containsAnyOfMx = (
  inStr: string,
  strMx: (string[] | readonly string[])[],
  matching?:
    | MtblRefValue<Kvp<number, Kvp<number, string | null | undefined>>>
    | null
    | undefined
) => {
  matching ??= {
    value: {
      key: -1,
      value: {
        key: -1,
        value: null,
      },
    },
  };

  const innerMatching = {} as MtblRefValue<
    Kvp<number, string | null | undefined>
  >;

  const kvp = findKvp(strMx, (strArr) =>
    containsAnyOfArr(inStr, strArr, innerMatching)
  );

  const retVal = kvp.key >= 0;

  if (retVal) {
    matching.value = {
      key: kvp.key,
      value: innerMatching.value,
    };
  }

  return retVal;
};

export const distinct = <T>(
  arr: T[],
  areEqualPredicate: ((a: T, b: T) => boolean) | null = null
) => {
  areEqualPredicate ??= (a, b) => a === b;
  let i = 0;

  while (i < arr.length) {
    const item = arr[i];
    const kvp = findKvp(arr, (v) => areEqualPredicate(item, v));

    if (kvp.key >= 0) {
      arr.splice(i, 1);
    } else {
      i++;
    }
  }

  return arr;
};

export const filterAsync = async <TIn>(
  inArr: TIn[],
  predicate: (inVal: TIn, idx?: number, arr?: TIn[]) => Promise<boolean>
) => {
  const outArr: TIn[] = [];
  const syncLock = new Uint32Array(new SharedArrayBuffer(32));

  for (let i = 0; i < inArr.length; i++) {
    const iVal = i;

    if (await predicate(inArr[iVal], iVal, inArr)) {
      const idx = Atomics.add(syncLock, 0, 1);
      outArr[idx] = inArr[iVal];
    }
  }
};

export const mapAsync = async <TIn, TOut>(
  inArr: TIn[],
  factory: (inVal: TIn, idx?: number, arr?: TIn[]) => Promise<TOut>
) => {
  const outArr: TOut[] = [];

  for (let i = 0; i < inArr.length; i++) {
    outArr[i] = await factory(inArr[i], i, inArr);
  }

  return outArr;
};

export const findIdxAsync = async <TIn>(
  inArr: TIn[],
  predicate: (inVal: TIn, idx?: number, arr?: TIn[]) => Promise<boolean>
) => {
  let idx = -1;

  for (let i = 0; i < inArr.length; i++) {
    const iVal = i;

    if (await predicate(inArr[iVal], iVal, inArr)) {
      idx = iVal;
      break;
    }
  }

  return idx;
};

export const findAsync = async <TIn>(
  inArr: TIn[],
  predicate: (inVal: TIn, idx?: number, arr?: TIn[]) => Promise<boolean>
) => {
  const idx = await findIdxAsync(inArr, predicate);
  let retVal: TIn | null = null;

  if (idx >= 0) {
    retVal = inArr[idx];
  }

  return retVal;
};

export const flatten = <T>(
  mx: T[][],
  removeDupplicates = false,
  areEqualPredicate: ((a: T, b: T) => boolean) | null = null
) => {
  areEqualPredicate ??= (a, b) => a === b;

  const retArr: T[] = mx.reduce((a, b) => {
    a.splice(a.length, 0, ...b);
    return a;
  }, []);

  if (removeDupplicates) {
    distinct(retArr, areEqualPredicate);
  }

  return retArr;
};

export const freezeMx = <T>(mx: T[][]) =>
  Object.freeze(mx.map((arr) => Object.freeze(arr)));

export const removeAllIdxes = <T>(
  inputArr: T[],
  idxesArr: number[],
  spreadAndSortIdxesFirst = true
) => {
  if (spreadAndSortIdxesFirst) {
    idxesArr = [...idxesArr];
    idxesArr.sort();
  }

  for (let i = idxesArr.length - 1; i >= 0; i--) {
    const idx = idxesArr[i];

    if (idx >= 0) {
      inputArr.splice(idx, 1);
    } else {
      break;
    }
  }

  return inputArr;
};

export const removeAll = <T>(
  inputArr: T[],
  predicate: T[] | ((item: T, idx: number, inArr: T[]) => ValueOrAny<boolean>),
  eqCompr: ((val1: T, val2: T) => number) | null | undefined = null
) => {
  if (typeof predicate === 'object') {
    const arr = predicate as T[];

    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      let idx: number;

      if (eqCompr) {
        idx = inputArr.findIndex((item) => eqCompr(value, item) === 0);
      } else {
        idx = inputArr.indexOf(value);
      }

      if (idx >= 0) {
        inputArr.splice(idx);
      }
    }
  } else {
    const predicateFunc = predicate as (
      item: T,
      idx: number,
      inArr: T[]
    ) => ValueOrAny<boolean>;

    const idxesArr = inputArr
      .map(
        (item, idx) =>
          ({
            key: idx,
            value: item,
          } as Kvp<number, T>)
      )
      .filter((kvp) => predicateFunc(kvp.value, kvp.key, inputArr))
      .map((kvp) => kvp.key);

    removeAllIdxes(inputArr, idxesArr);
  }

  return inputArr;
};

export const removeNullOrUndef = <T>(arr: T[]) =>
  arr.filter((val) => (val ?? false) !== false);

export interface Iterator<T = any> {
  [Symbol.iterator]: () => { next: () => { value: T; done: boolean } };
}

export interface PseudoArray {
  length: number;
}

export const queryMx = <T>(
  mx: Iterator<T> | PseudoArray,
  childNodesPropName: string,
  path: number[]
): T | undefined => {
  const idx = path[0];
  let i = 0;
  let found = false;
  const mxAsArr = mx as PseudoArray;
  let retVal: T | undefined = undefined;

  if (typeof mxAsArr.length === 'number') {
    if (mxAsArr.length > idx) {
      found = true;
      retVal = (mxAsArr as T[])[idx];
    }
  } else {
    for (let value of mx as Iterable<T>) {
      if (i === idx) {
        found = true;
        retVal = value;
      }
    }
  }

  if (found && path.length > 1) {
    const childMx = (retVal as { [prop: string]: Iterator<T> | PseudoArray })[
      childNodesPropName
    ];

    retVal = queryMx(childMx, childNodesPropName, path.slice(1));
  }

  return retVal;
};
