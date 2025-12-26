import Big from 'big.js';

import { actWithVal, NullOrUndef } from './core';

export const maxSafeInteger = Number.MAX_SAFE_INTEGER;

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

export const getOrderOfMagnitude = (num: number) => {
  let magn = 0;

  while (num > 0) {
    magn++;
    num = Math.floor(num / 10);
  }

  return magn;
};

export const numToString = (num: number) => new Big(num).toFixed();

export interface NumberDigits {
  intPartDigits: number[];
  decimals: number[];
  isNegative: boolean;
}

export const getNumberDigits = (num: number | NullOrUndef) => {
  if ((num ?? null) !== null && !isNaN(num!)) {
    const isNegative = num! < 0;
    let numStr = numToString(num!);

    if (isNegative) {
      numStr = numStr.substring(1);
    }

    let intPartStr = numStr;
    let decimalsStr = '';
    const decPtIdx = numStr.indexOf('.');

    if (decPtIdx >= 0) {
      intPartStr = numStr.substring(0, decPtIdx);
      decimalsStr = numStr.substring(decPtIdx + 1);
    }

    const retObj: NumberDigits = {
      isNegative,
      intPartDigits: [...intPartStr].map((char) => parseInt(char)),
      decimals: [...decimalsStr].map((char) => parseInt(char)),
    };

    return retObj;
  } else {
    return null;
  }
};

export const getIntNumberDigits = (num: number, base: number = 10) => {
  if (base <= 0) {
    throw new Error(`Base must be a strictly positive number, but received ${base}`);
  }

  let digit = num % base;
  let remainder = Math.floor(num / base);
  const digitsArr = [digit];

  while (remainder > 0) {
    digit = num % base;
    remainder = Math.floor(num / base);
    digitsArr.push(digit);
  }

  return digitsArr;
};

export const getIntNumberFromDigits = (digitsArr: number[], base: number = 10) => {
  if (base <= 0) {
    throw new Error(`Base must be a strictly positive number, but received ${base}`);
  }

  let num = digitsArr.at(-1) ?? null;

  if (num !== null) {
    let multiplier = base;

    for (let i = digitsArr.length - 2; i >= 0; i--) {
      num += digitsArr[i] * multiplier;
      multiplier *= base;
    }
  }

  return num;
};

export const numToHexStr = (number: number) =>
  getIntNumberDigits(number, 16)
    .map((num) => num.toString(16))
    .join('');

export const numFromHexStr = (hexStr: string) =>
  getIntNumberFromDigits(
    [...hexStr].map((char) => parseInt(char, 16)),
    16
  );

export const bytesToHexStr = (bytesArr: number[]) =>
  bytesArr.map((byte) => numToHexStr(byte)).join('');

export const bytesFromHexStr = (hexStr: string) => {
  const bytesArr: number[] = [];

  for (let i = hexStr.length - 1; i > 0; i--) {
    bytesArr.splice(0, 0, numFromHexStr(hexStr.substring(i, 2))!);
  }

  if (hexStr.length % 2) {
    bytesArr.splice(0, 0, numFromHexStr(hexStr[0])!);
  }

  return bytesArr;
};
