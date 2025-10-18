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
