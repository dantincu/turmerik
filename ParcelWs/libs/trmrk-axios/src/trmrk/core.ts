export const allWsRegex = () => /^\s+$/g;
export const digitRegex = () => /\d/g;
export const numberRegex = () => /^(\-\d|\d)?\.?\d+$/g;

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
      throw new Error(
        "Singleton must be registered before its value can be used"
      );
    }

    return this._value as T;
  }

  register(value: T) {
    if (this._initialized) {
      throw new Error(
        "Singleton has already been registered and cannot be registered twice"
      );
    }

    this._value = value;
  }
}

export interface Kvp<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export interface ValueOrError<TValue, TError = Error | any> {
  value?: TValue | undefined;
  error?: TError | undefined;
}

export type ValueOrAny<TValue> = TValue | any | unknown | null | undefined;
export type ValueOrAnyOrVoid<TValue> = ValueOrAny<TValue> | void;

export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const isNumStr = (arg: string) => {
  const retVal = !!numberRegex().test(arg);
  return retVal;
};

export const withVal = <TIn, TOut>(
  inVal: TIn,
  convertor: (input: TIn) => TOut
) => convertor(inVal);

export const actWithVal = <TVal>(
  val: TVal,
  action: (value: TVal) => unknown | any | void
) => {
  action(val);
  return val;
};

export const withValIf = <TIn, TOut>(
  inVal: TIn,
  convertor: (input: TIn) => TOut,
  defaultValueFactory: (input: TIn) => TOut,
  defaultInputPredicate?: ((input: TIn) => boolean) | null | undefined
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
  inVal: TVal,
  action: (input: TVal) => unknown | any | void,
  defaultAction:
    | ((input: TVal) => unknown | any | void)
    | null
    | undefined = null,
  defaultInputPredicate?: ((input: TVal) => boolean) | null | undefined
) => {
  defaultInputPredicate ??= (input) => (input ?? null) === null;

  if (defaultInputPredicate(inVal)) {
    if (defaultAction) {
      defaultAction(inVal);
    }
  } else {
    action(inVal);
  }
};
