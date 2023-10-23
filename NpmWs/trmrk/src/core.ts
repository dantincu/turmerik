export const allWsRegex = /^\s+$/g;

export const isNonEmptyStr = (arg: string | any, allWsSameAsEmpty = false) => {
  let retVal = "string" === typeof arg;
  retVal = retVal && arg !== "";

  if (retVal && allWsSameAsEmpty) {
    retVal = allWsRegex.test(arg);
  }

  return retVal;
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
