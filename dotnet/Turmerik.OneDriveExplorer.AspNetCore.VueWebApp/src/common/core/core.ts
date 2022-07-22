export interface IRefValue<TValue = any> {
  value: TValue | null | undefined;
}

export interface IKeyValuePair<TKey, TValue = any> extends IRefValue<TValue> {
  key: TKey;
}

export type StrHashKeyType<TValue = any> = {
  [key: string]: TValue;
};

export type NumHashKeyType<TValue = any> = {
  [key: number]: TValue;
};

export type HashKeyType<TValue = any> =
  | StrHashKeyType<TValue>
  | NumHashKeyType<TValue>;

export interface IHash<TValue> {
  [key: string]: TValue;
}

export type HashType<TKey extends HashKeyType<TValue>, TValue> = {
  [key in keyof TKey]: TValue;
};

export interface IStrHash extends IHash<string> {}

export abstract class ValueNormalizerCoreBase<
  TVal extends any | null | undefined
> {
  constructor(public val: TVal) {}

  abstract getDefaultValue(): TVal;
  abstract useDefaultValue(val: TVal): boolean;

  getNormalizedValue() {
    let retVal = this.val;

    if (this.useDefaultValue(this.val)) {
      retVal = this.getDefaultValue();
    }

    return retVal;
  }
}

export abstract class ValueNormalizerBase<
  TVal extends any | null | undefined
> extends ValueNormalizerCoreBase<TVal> {
  constructor(val: TVal, public dfVal: TVal) {
    super(val);
  }

  override getDefaultValue() {
    return this.dfVal;
  }
}

export abstract class ValueFactoryNormalizerBase<
  TVal extends any | null | undefined
> extends ValueNormalizerCoreBase<TVal> {
  constructor(val: TVal, public dfValFactory: () => TVal) {
    super(val);
  }

  override getDefaultValue() {
    const dfVal = this.dfValFactory();
    return dfVal;
  }
}

export class ObjValueNormalizer<
  TObj extends object | null | undefined
> extends ValueNormalizerBase<TObj> {
  constructor(val: TObj, dfVal: TObj) {
    super(val, dfVal);
  }

  useDefaultValue(val: TObj): boolean {
    const retVal = !Trmrk.valIsNotNullObj(val);
    return retVal;
  }
}

export class ObjValueFactoryNormalizer<
  TObj extends object | null | undefined
> extends ValueFactoryNormalizerBase<TObj> {
  constructor(val: TObj, dfValFactory: () => TObj) {
    super(val, dfValFactory);
  }

  useDefaultValue(val: TObj): boolean {
    const retVal = !Trmrk.valIsNotNullObj(val);
    return retVal;
  }
}

export class NumValueNormalizer extends ValueNormalizerBase<
  Number | null | undefined
> {
  constructor(
    val: Number | null | undefined,
    dfVal: Number | null | undefined
  ) {
    super(val, dfVal);
  }

  useDefaultValue(val: Number | null | undefined): boolean {
    const retVal = !Trmrk.valIsNotNaNNumber(val);
    return retVal;
  }
}

export class NumValueFactoryNormalizer extends ValueFactoryNormalizerBase<
  Number | null | undefined
> {
  constructor(
    val: Number | null | undefined,
    dfValFactory: () => Number | null | undefined
  ) {
    super(val, dfValFactory);
  }

  useDefaultValue(val: Number | null | undefined): boolean {
    const retVal = !Trmrk.valIsNotNaNNumber(val);
    return retVal;
  }
}

export class StrValueNormalizer extends ValueNormalizerBase<
  String | null | undefined
> {
  constructor(
    val: String | null | undefined,
    dfVal: String | null | undefined,
    public allowEmpty = true,
    public trimFirst = false
  ) {
    super(val, dfVal);
  }

  useDefaultValue(val: String | null | undefined): boolean {
    const retVal = !Trmrk.valIStr(val, this.allowEmpty, this.trimFirst);
    return retVal;
  }
}

export class StrValueFactoryNormalizer extends ValueFactoryNormalizerBase<
  String | null | undefined
> {
  constructor(
    val: String | null | undefined,
    dfValFactory: () => String | null | undefined,
    public allowEmpty = true,
    public trimFirst = false
  ) {
    super(val, dfValFactory);
  }

  useDefaultValue(val: String | null | undefined): boolean {
    const retVal = !Trmrk.valIStr(val, this.allowEmpty, this.trimFirst);
    return retVal;
  }
}

export namespace Trmrk {
  export const dblSpace = "  ";
  export const dblBackSlash = "\\\\";
  export const quoteChars: IStrHash = Object.freeze({
    '"': '\\"',
    "'": "\\'",
  });

  export const javascriptVoid = "javascript:void(0);";

  export const trmrkPrefix = <IRefValue<string>>{
    value: "trmrk",
  };

  export const valIs = (
    val: any | null | undefined,
    predicate: (value: any | null | undefined, valueType: string) => boolean
  ) => {
    const retVal = predicate(val, typeof val);
    return retVal;
  };

  export const valIsUndef = (val: any | null | undefined) =>
    typeof val === "undefined";

  export const valIsOfTypeObject = (val: any | null | undefined) =>
    typeof val === "object";

  export const valIsOfTypeFunc = (val: any | null | undefined) =>
    typeof val === "function";

  export const valIsOfTypeBoolean = (val: any | null | undefined) =>
    typeof val === "boolean";

  export const valIsOfTypeNumber = (val: any | null | undefined) =>
    typeof val === "number";

  export const valIsOfTypeString = (val: any | null | undefined) =>
    typeof val === "string";

  export const valIsOfTypeBigInt = (val: any | null | undefined) =>
    typeof val === "bigint";

  export const valIsOfTypeSymbol = (val: any | null | undefined) =>
    typeof val === "symbol";

  export const valIsNullOfUndef = (val: any | null | undefined) =>
    val === null || typeof val === "undefined";

  export const valIsNullOfUndefOrNaN = (value: any | null | undefined) =>
    value === null ||
    valIs(
      value,
      (val, type) => type === "undefined" || (type === "number" && isNaN(val))
    );

  export const valIsNotNullObj = (val: any | null | undefined) =>
    val !== null && valIsOfTypeObject(val);

  export const valIsNaNNumber = (val: any | null | undefined) =>
    typeof val === "number" && isNaN(val);

  export const valIsNotNaNNumber = (val: any | null | undefined) =>
    typeof val === "number" && !isNaN(val);

  export const valIStr = (
    val: any | null | undefined,
    allowEmpty = true,
    trimFirst = false
  ) => {
    let retVal = typeof val === "string";

    if (retVal && !allowEmpty) {
      if (trimFirst) {
        val = (val as String).trim();
      }

      retVal = val !== "";
    }

    return retVal;
  };

  export const withVal = <TVal extends any, TRetVal extends any | void>(
    value: TVal,
    callback: (val: TVal) => TRetVal
  ) => {
    const retVal = callback(value);
    return retVal;
  };

  export const escapeQuote = (strVal: string, qStr: '"' | "'" = '"') => {
    strVal = strVal.replaceAll("\\", dblBackSlash);
    const replQ = quoteChars[qStr];

    strVal = strVal.replaceAll(qStr, replQ);
    return strVal;
  };

  export const escapeHtml = (strVal: string) => {
    strVal = strVal
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

    return strVal;
  };

  export const firstLetterToLowerCase = (strVal: string) => {
    strVal = strVal[0].toLowerCase() + strVal.substring(1);
    return strVal;
  };

  export const firstLetterToUpperCase = (strVal: string) => {
    strVal = strVal[0].toUpperCase() + strVal.substring(1);
    return strVal;
  };

  export const numberIs = (
    value: number | any | null | undefined,
    callback: (val: number) => boolean,
    defaultValue = false
  ) => {
    let retVal = defaultValue;

    if (valIsNotNaNNumber(value)) {
      retVal = callback(value);
    }

    return retVal;
  };

  export const numbersAre = (
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    callback: (trgVal: number, srcVal: number) => boolean
  ) => {
    const retValue = numberIs(trgValue, (trgVal) =>
      numberIs(srcValue, (srcVal) => callback(trgVal, srcVal), true)
    );

    return retValue;
  };

  export const numberIsGreaterThan = (
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    strictlyGreatherThan = false
  ) => {
    const retValue = numbersAre(trgValue, srcValue, (trgVal, srcVal) => {
      let retVal: boolean;

      if (strictlyGreatherThan) {
        retVal = trgVal > srcVal;
      } else {
        retVal = trgVal >= srcVal;
      }

      return retVal;
    });

    return retValue;
  };

  export const numberIsLessThan = (
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    strictlyLessThan = false
  ) => {
    const retValue = numbersAre(trgValue, srcValue, (trgVal, srcVal) => {
      let retVal: boolean;

      if (strictlyLessThan) {
        retVal = trgVal < srcVal;
      } else {
        retVal = trgVal <= srcVal;
      }

      return retVal;
    });

    return retValue;
  };

  export const numberIsInRange = (
    value: number | any | null | undefined,
    min: number | null = null,
    max: number | null = null,
    strictlyGreatherThan = false,
    strictlyLessThan = false
  ) => {
    let retVal = numberIsGreaterThan(value, min, strictlyGreatherThan);
    retVal = retVal && numberIsLessThan(value, min, strictlyLessThan);

    return retVal;
  };

  export const throwErr = (err: any) => {
    if (typeof err !== "object") {
      err = new Error(err);
    }

    throw err;
  };

  export const isIterable = (obj: any) => {
    const retVal = typeof obj[Symbol.iterator] === "function";
    return retVal;
  };

  export const readFromClipboardAsync = async () => {
    const text = await navigator.clipboard.readText();
    return text;
  };

  export const writeToClipboardAsync = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };
}
