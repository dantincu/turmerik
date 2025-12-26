import { NullOrUndef } from './core';
import { tryDigestStr } from './str';

import { bytesFromHexStr, bytesToHexStr } from './math';

export interface ColorCore {
  text?: string | NullOrUndef;
  bytes?: number[] | NullOrUndef;
  hasAlpha?: boolean | NullOrUndef;
  hexStr?: string | NullOrUndef;
  shortHexStr?: string | NullOrUndef;
  rgbaStr?: string | NullOrUndef;
}

export const getShortHexStr = (hexStr: string) =>
  [...hexStr].map((char, i) => (i % 2 ? '' : char)).join('');

export const bytesToRgba = (bytesArr: number[]) =>
  ['rgba(', bytesArr.map((byte) => byte.toString()).join(', '), ')'].join('');

export const bytesFromRgba = (rgbaStr: string) => {
  rgbaStr = tryDigestStr(rgbaStr, 'rgba', (newStr) => newStr);
  rgbaStr = tryDigestStr(rgbaStr, '(', (newStr) => newStr);
  rgbaStr = tryDigestStr(rgbaStr, ')', (newStr) => newStr, false);
  const bytesArr = rgbaStr.split(',').map((component) => parseInt(component));
  return bytesArr;
};

export const updateColorHasAlphaFlag = (color: ColorCore) => {
  color.hasAlpha = color.bytes!.length === 4;
  return color;
};

export const updateColorRgbaFromBytes = (color: ColorCore) => {
  if (color.bytes && color.bytes.findIndex((byte) => (byte ?? null) === null) < 0) {
    color.rgbaStr = bytesToRgba(color.bytes);
    color = updateColorHasAlphaFlag(color);
  }

  return color;
};

export const normalizeColorFromBytes = (color: ColorCore) => {
  const hexStr = bytesToHexStr(color.bytes!);
  const shortHexStr = getShortHexStr(hexStr);
  color.hexStr = `#${hexStr}`;
  color.shortHexStr = `#${shortHexStr}`;
  color = updateColorRgbaFromBytes(color);
  return color;
};

export const normalizeColorFromHexStr = (color: ColorCore) => {
  const hexStr = color.hexStr!.trim().substring(1);
  const shortHexStr = getShortHexStr(hexStr);
  color.bytes = bytesFromHexStr(hexStr);
  color.shortHexStr = `#${shortHexStr}`;
  color = updateColorRgbaFromBytes(color);
  return color;
};

export const normalizeColorFromShortHexStr = (color: ColorCore) => {
  const shortHexStr = color.shortHexStr!.trim().substring(1);
  const hexStr = [...shortHexStr].map((char) => char + char).join('');
  color.hexStr = `#${hexStr}`;
  color.bytes = bytesFromHexStr(hexStr);
  color = updateColorRgbaFromBytes(color);
  return color;
};

export const normalizeColorFromRgbaStr = (color: ColorCore) => {
  color.bytes = bytesFromRgba(color.rgbaStr!);
  const hexStr = bytesToHexStr(color.bytes);
  const shortHexStr = getShortHexStr(hexStr);
  color.hexStr = `#${hexStr}`;
  color.shortHexStr = `#${shortHexStr}`;
  color = updateColorHasAlphaFlag(color);
  return color;
};

export const normalizeColorFromText = (color: ColorCore) => {
  let retColor: ColorCore | NullOrUndef;

  if (color.text!.indexOf(',') >= 0) {
    retColor = normalizeColorFromRgbaStr(color);
  } else {
    switch (color.text!.length) {
      case 7:
      case 9:
        retColor = normalizeColorFromHexStr(color);
        break;
      case 4:
      case 5:
        retColor = normalizeColorFromShortHexStr(color);
        break;
      default:
        retColor = null;
        break;
    }
  }

  return retColor;
};

export const normalizeColor = (color: ColorCore | NullOrUndef) => {
  if (color) {
    if (color.bytes && color.bytes.findIndex((byte) => (byte ?? null) === null) < 0) {
      color = normalizeColorFromBytes(color);
    } else if ((color.hexStr ?? null) !== null) {
      color = normalizeColorFromHexStr(color);
    } else if ((color.shortHexStr ?? null) !== null) {
      color = normalizeColorFromShortHexStr(color);
    } else if ((color.rgbaStr ?? null) !== null) {
      color = normalizeColorFromRgbaStr(color);
    } else if ((color.text ?? null) !== null) {
      color = normalizeColorFromText(color);
    } else {
      color = null;
    }
  }

  return color;
};
