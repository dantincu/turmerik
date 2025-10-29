import { NullOrUndef } from './core';

export const mergeUint8Arrays = <TArrayBuffer extends ArrayBufferLike>(
  arrays: Uint8Array<TArrayBuffer>[],
  factory?: ((totalLength: number) => Uint8Array<TArrayBuffer>) | NullOrUndef
) => {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  factory ??= (len) => new Uint8Array(len) as Uint8Array<TArrayBuffer>;
  const retArray = factory(totalLength);
  let offset = 0;

  for (let arr of arrays) {
    retArray.set(arr, offset);
    offset += arr.length;
  }

  return retArray;
};

export const splitArray = <TArrayBuffer extends ArrayBufferLike>(
  array: Uint8Array<TArrayBuffer>,
  maxArraySize: number,
  factory?: ((totalLength: number) => Uint8Array<TArrayBuffer>) | NullOrUndef
) => {
  const retMx: Uint8Array<TArrayBuffer>[] = [];
  factory ??= (len) => new Uint8Array(len) as Uint8Array<TArrayBuffer>;

  for (let i = 0; i < array.length; i += maxArraySize) {
    const nextArrSize = Math.min(maxArraySize, array.length - i);
    const nextArr = factory(nextArrSize);
    nextArr.set(array.slice(i, i + nextArrSize));
    retMx.push(nextArr);
  }

  return retMx;
};
