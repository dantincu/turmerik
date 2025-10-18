import { NullOrUndef } from './core';
import { mergeUint8Arrays } from './Uint8Array';

export const encodings = Object.freeze({
  utf8: 'utf-8',
});

export const encodeHtml = (str: string, useNonBreakingSpaces = false) => {
  str = str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  if (useNonBreakingSpaces) {
    str = str.replaceAll(' ', '&nbsp;');
  }

  return str;
};

export const getTextFromUint8Array = <TArrayBuffer extends ArrayBufferLike>(
  array: Uint8Array<TArrayBuffer>,
  encoding?: string | NullOrUndef
) => {
  encoding ??= encodings.utf8;
  const decoder = new TextDecoder(encoding);
  const text = decoder.decode(array);
  return text;
};

export const getTextFromUint8ArrayChunks = <TArrayBuffer extends ArrayBufferLike>(
  chunks: Uint8Array<TArrayBuffer>[],
  encoding?: string | NullOrUndef,
  arrayFactory?: ((totalLength: number) => Uint8Array<TArrayBuffer>) | NullOrUndef
) => {
  const array = mergeUint8Arrays(chunks, arrayFactory);
  const text = getTextFromUint8Array(array, encoding);

  return text;
};
