export const allWsRegex = () => /^\s+$/g;
export const digitRegex = () => /\d/g;
export const numberRegex = () => /^(\-\d|\d)?\.?\d+$/g;

export interface MtblRefValue<T> {
  value: T;
}

export class RefLazyValue<T> {
  private _value: T | null = null;
  private _initialized = false;

  constructor(public factory: () => T) {}

  get value() {
    if (!this._initialized) {
      this._value = this.factory();
      this._initialized = true;
    }

    return this._value as T;
  }
}

export interface Kvp<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export interface ValueOrError<TValue, TError = Error | any> {
  value?: TValue | undefined;
  error?: TError | undefined;
}

export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const isNotNullObj = (arg: any) => {
  let retVal = "object" === typeof arg;
  retVal = retVal && arg !== null;

  return retVal;
};

export const isNonEmptyStr = (arg: string | any, allWsSameAsEmpty = false) => {
  let retVal = "string" === typeof arg;
  retVal = retVal && arg !== "";

  if (retVal && allWsSameAsEmpty) {
    retVal = !allWsRegex().test(arg);
  }

  return retVal;
};

export const isNumStr = (arg: string) => {
  const retVal = !!numberRegex().test(arg);
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

/**
 * taken from https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
 **/
export const proxiedPropsOf = <TObj>(obj?: TObj) => {
  return new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error("Set not supported");
      },
    }
  ) as {
    [P in keyof TObj]?: P;
  };
};

export const propOf = <TObj>(name: keyof TObj) => {
  return name;
};

export const propsOf = <TObj>(_obj: TObj | undefined = undefined) => {
  const result = <T extends keyof TObj>(name: T) => {
    return name;
  };

  return result;
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

export const toMap = <TValue>(arr: Kvp<string, TValue>[]) => {
  const retMap: { [key: string]: TValue } = {};

  for (let kvp of arr) {
    retMap[kvp.key] = kvp.value;
  }

  return retMap;
};

export const forEachProp = <TObj extends Object>(
  obj: TObj,
  callback: (
    propVal: any,
    propName: string,
    objMap: { [key: string]: any },
    objPropNames: string[],
    obj: TObj
  ) => void
) => {
  const objMap = obj as { [key: string]: any };
  const objPropNames = Object.getOwnPropertyNames(obj);

  for (let propName of objPropNames) {
    const propVal = objMap[propName];
    callback(propVal, propName, objMap, objPropNames, obj);
  }
};

export const merge = <TTrgObj extends Object>(
  trgObj: TTrgObj,
  srcObjsArr: Object[],
  depth: number = 0
) => {
  const trgObjMap = trgObj as { [key: string]: any };

  for (let srcObj of srcObjsArr) {
    const srcObjMap = srcObj as { [key: string]: any };
    for (let propName of Object.getOwnPropertyNames(srcObj)) {
      const srcPropVal = srcObjMap[propName];

      if (srcPropVal ?? false) {
        if (!(trgObjMap[propName] ?? false) ?? false) {
          trgObjMap[propName] = srcPropVal;
        } else if (depth > 0) {
          merge(trgObj, [srcObj], depth - 1);
        }
      }
    }
  }

  return trgObj;
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

export const withVal = <TIn, TOut>(
  inVal: TIn,
  convertor: (input: TIn) => TOut
) => convertor(inVal);

export const actWithVal = <TVal>(
  val: TVal,
  action: (value: TVal) => unknown | any | void
) => {
  action(val);
  return val;
};

export const withValIf = <TIn, TOut>(
  inVal: TIn,
  convertor: (input: TIn) => TOut,
  defaultValueFactory: (input: TIn) => TOut,
  defaultInputPredicate?: ((input: TIn) => boolean) | null | undefined
) => {
  defaultInputPredicate ??= (input) => !input;
  let retVal: TOut;

  if (defaultInputPredicate(inVal)) {
    retVal = defaultValueFactory(inVal);
  } else {
    retVal = convertor(inVal);
  }

  return retVal;
};

export const actWithValIf = <TVal>(
  inVal: TVal,
  action: (input: TVal) => unknown | any | void,
  defaultAction:
    | ((input: TVal) => unknown | any | void)
    | null
    | undefined = null,
  defaultInputPredicate?: ((input: TVal) => boolean) | null | undefined
) => {
  defaultInputPredicate ??= (input) => !input;

  if (defaultInputPredicate(inVal)) {
    if (defaultAction) {
      defaultAction(inVal);
    }
  } else {
    action(inVal);
  }
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
