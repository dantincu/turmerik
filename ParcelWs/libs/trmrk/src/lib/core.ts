export type NullOrUndef = null | undefined;
export type AnyOrUnknown = any | unknown | NullOrUndef;
export type VoidOrAny = void | AnyOrUnknown;

export type ValueOrAny<TValue> = TValue | AnyOrUnknown;
export type ValueOrAnyOrVoid<TValue> = ValueOrAny<TValue> | void;

export const allWsRegex = () => /^\s+$/g;
export const digitRegex = () => /\d/g;
export const numberRegex = () => /^(\-\d|\d)?\.?\d+$/g;
export const letterRegex = () => /[a-zA-Z]/;
export const unicodeLetterRegex = () => /\p{L}/u;

// . ^ $ * + ? ( ) [ ] { } \ |
export const regexSpecialChars = '.^$*+?()[]{}|\\';

export type Constructor<T = {}> = new (...args: any[]) => T;

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

export class Singleton<T> {
  private _value: T | null = null;
  private _initialized = false;

  get value() {
    if (!this._initialized) {
      throw new Error('Singleton must be registered before its value can be used');
    }

    return this._value as T;
  }

  register(value: T) {
    if (this._initialized) {
      throw new Error('Singleton has already been registered and cannot be registered twice');
    }

    this._value = value;
  }
}

export type Map<T> = { [key: string | number]: T };
export type StrMap<T> = { [key: string]: T };
export type NumMap<T> = { [key: number]: T };
export type UnifiedMap<T> = Map<T> | StrMap<T> | NumMap<T>;

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

export const getJsonBool = (value: boolean) => (value ? jsonBool.true : jsonBool.false);

export const isNumStr = (arg: string) => {
  const retVal = !!numberRegex().test(arg);
  return retVal;
};

export const withVal = <TIn, TOut>(inVal: TIn, convertor: (input: TIn) => TOut) => convertor(inVal);

export const actWithVal = <TVal>(val: TVal, action: (value: TVal) => unknown | any | void) => {
  action(val);
  return val;
};

export const withValIf = <TIn, TOut>(
  inVal: TIn,
  convertor: (input: TIn) => TOut,
  defaultValueFactory: (input: TIn | NullOrUndef) => TOut,
  defaultInputPredicate?: ((input: TIn | NullOrUndef) => boolean) | NullOrUndef
) => {
  defaultInputPredicate ??= (input) => (input ?? null) === null;
  let retVal: TOut;

  if (defaultInputPredicate(inVal)) {
    retVal = defaultValueFactory(inVal);
  } else {
    retVal = convertor(inVal);
  }

  return retVal;
};

export const actWithValIf = <TVal>(
  inVal: TVal | NullOrUndef,
  action: (input: TVal) => unknown | any | void,
  defaultAction: ((input: TVal | NullOrUndef) => unknown | any | void) | NullOrUndef = null,
  defaultInputPredicate?: ((input: TVal | NullOrUndef) => boolean) | NullOrUndef
) => {
  defaultInputPredicate ??= (input) => (input ?? null) === null;

  if (defaultInputPredicate(inVal)) {
    if (defaultAction) {
      defaultAction(inVal);
    }
  } else {
    action(inVal!);
  }

  return inVal;
};

export const actWithIf = <TVal>(
  inVal: TVal | NullOrUndef,
  action: (input: TVal) => unknown | any | void,
  defaultAction: ((input: TVal | NullOrUndef) => unknown | any | void) | NullOrUndef = null,
  defaultInputPredicate?: ((input: TVal | NullOrUndef) => boolean) | NullOrUndef
) => {
  defaultInputPredicate ??= (input) => (input ?? null) === null;
  const retVal = defaultInputPredicate(inVal);

  if (retVal) {
    if (defaultAction) {
      defaultAction(inVal);
    }
  } else {
    action(inVal!);
  }

  return retVal;
};

export const asNumber = (val: number | NullOrUndef, dfVal: number): number =>
  (isNaN(val ?? NaN) ? dfVal : val) as number;

export const nullify = <T>(val: T | NullOrUndef) => (val ? val : null);

export enum UserMessageLevel {
  Success = 0,
  Info,
  Warn,
  Error,
}

export const iterableToArray = <T>(list: Iterable<T>) => {
  const retArr: T[] = [];

  for (let value of list) {
    retArr.push(value);
  }

  return retArr;
};

export const cast = <T>(obj?: any) => obj as T;

export const escapeRegexSpecialChars = (str: string) => {
  let retStr = str;

  for (let ch of regexSpecialChars) {
    retStr = retStr.replaceAll(ch, `\\${ch}`);
  }

  return retStr;
};
