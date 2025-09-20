import { NullOrUndef } from './core';
import { isUnicodeLetter, isDigit, isLetter, isAsciiChar, capitalizeFirstLetter } from './str';
import { mapObjProps } from './obj';

export enum PropNameWordsConvention {
  None = 0,
  CamelCase,
  PascalCase,
  KebabCase,
  SnakeCase,
}

export enum PropNameCharType {
  Letter = 0,
  Digit,
  NonAlphaNumeric,
}

export enum PropNameWordCharBehavior {
  BelongsToCurrentWord = 0,
  StartsNewWord,
  GroupInSeparateWord,
}

export type ExtractCamelCasePropNameWordCharBehaviorRetriever = (
  char: string,
  idx: number,
  currentPartStartIdx: number,
  propName: string
) => PropNameWordCharBehavior;

export interface ExtractCamelCasePropNameWordsOpts {
  digitBehavior?: ExtractCamelCasePropNameWordCharBehaviorRetriever | NullOrUndef;
  nonAlphaNumericCharBehavior?: ExtractCamelCasePropNameWordCharBehaviorRetriever | NullOrUndef;
  unicodeLetterBehavior?: ExtractCamelCasePropNameWordCharBehaviorRetriever | NullOrUndef;
}

export const extractCamelCasePropNameWords = (
  propName: string,
  opts?: ExtractCamelCasePropNameWordsOpts | NullOrUndef
) => {
  opts ??= {};

  opts.digitBehavior ??= () => PropNameWordCharBehavior.BelongsToCurrentWord;
  opts.nonAlphaNumericCharBehavior ??= () => PropNameWordCharBehavior.BelongsToCurrentWord;
  opts.unicodeLetterBehavior ??= () => PropNameWordCharBehavior.BelongsToCurrentWord;

  const letterBehavior: ExtractCamelCasePropNameWordCharBehaviorRetriever = (chr) =>
    chr === chr.toLowerCase()
      ? PropNameWordCharBehavior.BelongsToCurrentWord
      : PropNameWordCharBehavior.StartsNewWord;

  const partsArr: string[] = [];

  if (propName.length) {
    let currentPartStartIdx = 0;
    let behavior: PropNameWordCharBehavior | null = null;
    let prevBehavior: PropNameWordCharBehavior | null = null;

    for (let i = 0; i < propName.length; i++) {
      const chr = propName[i];
      const charIsDigit = isDigit(chr);
      const charIsLetter = !charIsDigit && isLetter(chr);
      const isStdAlphaNumeric = charIsDigit || charIsLetter;
      const charIsUnicodeLetter = !isStdAlphaNumeric && isUnicodeLetter(chr);

      if (charIsDigit) {
        behavior = opts.digitBehavior(chr, i, currentPartStartIdx, propName);
      } else if (charIsLetter) {
        behavior = letterBehavior(chr, i, currentPartStartIdx, propName);
      } else if (charIsUnicodeLetter) {
        behavior = opts.unicodeLetterBehavior(chr, i, currentPartStartIdx, propName);
      } else {
        behavior = opts.nonAlphaNumericCharBehavior(chr, i, currentPartStartIdx, propName);
      }

      if (prevBehavior !== null) {
        if (behavior > prevBehavior) {
          partsArr.push(propName.substring(currentPartStartIdx, i));
          currentPartStartIdx = i;
        } else if (
          behavior === PropNameWordCharBehavior.BelongsToCurrentWord &&
          prevBehavior === PropNameWordCharBehavior.StartsNewWord
        ) {
          if (i - currentPartStartIdx > 1) {
            partsArr.push(propName.substring(currentPartStartIdx, i - 1));
            currentPartStartIdx = i - 1;
          }
        }
      }

      prevBehavior = behavior;
    }

    if (propName.length - currentPartStartIdx > 1) {
      partsArr.push(propName.substring(currentPartStartIdx));
    }
  }

  return partsArr;
};

export const detectPropNameWordsConvention = (
  propName: string,
  unicodeCharsAllowed?: boolean | NullOrUndef
) => {
  unicodeCharsAllowed ??= true;
  let convention: PropNameWordsConvention | null = null;

  if (propName.length) {
    let hasDash = false;
    let hasUnderscore = false;
    let hasLowercaseLetter = false;
    let hasUppercaseLetter = false;
    let containsUnicode = false;

    for (let i = 0; i < propName.length; i++) {
      let $break = false;
      const chr = propName[i];

      const handleLetter = () => {
        if (chr === chr.toLowerCase()) {
          hasLowercaseLetter = true;
        } else {
          hasUppercaseLetter = true;
        }
      };

      switch (chr) {
        case '-':
          hasDash = true;
          break;
        case '_':
          hasUnderscore = true;
          break;
        default:
          if (isAsciiChar(chr)) {
            if (isLetter(chr)) {
              handleLetter();
            }
          } else {
            containsUnicode = true;

            if (unicodeCharsAllowed) {
              if (isUnicodeLetter(chr)) {
                handleLetter();
              }
            } else {
              $break = true;
            }
          }

          break;
      }

      $break =
        [hasDash, hasUnderscore, hasLowercaseLetter, hasUppercaseLetter].findIndex(
          (flag) => !flag
        ) < 0;

      if ($break) {
        break;
      }
    }

    if (unicodeCharsAllowed || !containsUnicode) {
      if (hasDash && !hasUppercaseLetter) {
        convention = PropNameWordsConvention.KebabCase;
      } else if (hasUnderscore && !hasLowercaseLetter) {
        convention = PropNameWordsConvention.SnakeCase;
      } else {
        const firstChar = propName[0];

        if (firstChar === firstChar.toLowerCase()) {
          convention = PropNameWordsConvention.CamelCase;
        } else {
          convention = PropNameWordsConvention.PascalCase;
        }
      }
    }
  }

  return convention;
};

export const extractPropNameWords = (
  propName: string,
  convention?: PropNameWordsConvention | NullOrUndef,
  extractCamelCasePropNameWordsOptsFactory?: (() => ExtractCamelCasePropNameWordsOpts) | NullOrUndef
) => {
  convention ??= detectPropNameWordsConvention(propName);
  let wordsArr: string[];

  if ((convention ?? null) === null) {
    wordsArr = [propName];
  } else {
    switch (convention) {
      case PropNameWordsConvention.CamelCase:
      case PropNameWordsConvention.PascalCase:
        let opts: ExtractCamelCasePropNameWordsOpts | null = null;

        if (extractCamelCasePropNameWordsOptsFactory) {
          opts = extractCamelCasePropNameWordsOptsFactory();
        }

        wordsArr = extractCamelCasePropNameWords(propName, opts);
        break;
      case PropNameWordsConvention.KebabCase:
        wordsArr = propName.split('-');
        break;
      case PropNameWordsConvention.SnakeCase:
        wordsArr = propName.split('_');
        break;
      default:
        wordsArr = [propName];
    }
  }

  return wordsArr;
};

export const getPropNameFromWords = (wordsArr: string[], convention: PropNameWordsConvention) => {
  let propName: string;

  switch (convention) {
    case PropNameWordsConvention.CamelCase:
      propName = wordsArr
        .map((word, i) => (i === 0 ? word.toLowerCase() : capitalizeFirstLetter(word)))
        .join('');
      break;
    case PropNameWordsConvention.PascalCase:
      propName = wordsArr.map((word) => capitalizeFirstLetter(word)).join('');
      break;
    case PropNameWordsConvention.KebabCase:
      propName = wordsArr.map((word) => word.toLowerCase()).join('-');
      break;
    case PropNameWordsConvention.SnakeCase:
      propName = wordsArr.map((word) => word.toUpperCase()).join('_');
      break;
    default:
      propName = wordsArr.join('');
      break;
  }

  return propName;
};

export const convertPropName = (
  propName: string,
  targetConvention: PropNameWordsConvention,
  currentConvention?: PropNameWordsConvention | NullOrUndef,
  extractCamelCasePropNameWordsOptsFactory?: (() => ExtractCamelCasePropNameWordsOpts) | NullOrUndef
) => {
  const wordsArr = extractPropNameWords(
    propName,
    currentConvention,
    extractCamelCasePropNameWordsOptsFactory
  );

  const newPropName = getPropNameFromWords(wordsArr, targetConvention);
  return newPropName;
};

export const mapPropNamesToThemselves = <TObj extends Object>(
  obj: TObj,
  targetConvention?: PropNameWordsConvention,
  currentConvention?: PropNameWordsConvention | NullOrUndef,
  extractCamelCasePropNameWordsOptsFactory?: (() => ExtractCamelCasePropNameWordsOpts) | NullOrUndef
) =>
  mapObjProps(
    obj,
    (targetConvention ?? null) === null
      ? (_, p) => p
      : (_, p) =>
          convertPropName(
            p,
            targetConvention!,
            currentConvention,
            extractCamelCasePropNameWordsOptsFactory
          )
  );
