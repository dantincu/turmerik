export const allWsRegex = /^\s+$/g;

export interface MtblRefValue<T> {
  value: T;
}

export interface Kvp<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export const isNonEmptyStr = (arg: string | any, allWsSameAsEmpty = false) => {
  let retVal = "string" === typeof arg;
  retVal = retVal && arg !== "";

  if (retVal && allWsSameAsEmpty) {
    retVal = !allWsRegex.test(arg);
  }

  return retVal;
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
