import { NullOrUndef } from './core';

export const getNextIdx = (dimSizes: number[], dimIdxes: number[]) => {
  dimSizes = [...dimSizes].reverse();
  let magn = 1;

  const dimMagnitudes = dimSizes
    .map((_, i) => {
      const retVal = i === 0 ? 1 : magn * dimSizes[i - 1];
      magn *= retVal;
      return retVal;
    })
    .reverse();

  dimSizes.reverse();

  const retVal = dimIdxes.map((idx, i) => idx * dimMagnitudes[i]).reduce((acc, val) => acc + val);

  return retVal;
};

export const numIsBetween = (num: number, min: number, max: number, strictComparison = false) => {
  let result: boolean;

  if (strictComparison) {
    result = num > min && num < max;
  } else {
    result = num >= min && num <= max;
  }

  return result;
};
