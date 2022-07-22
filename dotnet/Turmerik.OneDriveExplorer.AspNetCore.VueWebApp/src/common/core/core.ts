export interface IRefValue<TValue> {
  value: TValue | null | undefined;
}

export interface IKeyValuePair<TKey, TValue> extends IRefValue<TValue> {
  key: TKey;
}

export type StrHashKeyType<TValue> = {
  [key: string]: TValue;
};

export type NumHashKeyType<TValue> = {
  [key: number]: TValue;
};

export type HashKeyType<TValue> =
  | StrHashKeyType<TValue>
  | NumHashKeyType<TValue>;

export interface IHash<TValue> {
  [key: string]: TValue;
}

export type HashType<TKey extends HashKeyType<TValue>, TValue> = {
  [key in keyof TKey]: TValue;
};

export interface IStrHash extends IHash<string> {}

export class ValueWrapper {
  value: any | null | undefined;

  valIsUndef: boolean | undefined;
  valIsNull: boolean | undefined;
  valIsNaN: boolean | undefined;

  valIsOfTypeBool: boolean | undefined;
  valIsOfTypeString: boolean | undefined;
  valIsOfTypeObject: boolean | undefined;
  valIsOfTypeNumber: boolean | undefined;
  valIsOfTypeBigint: boolean | undefined;
  valIsOfTypeSymbol: boolean | undefined;

  valIsNonEmptyString: boolean | undefined;
  valIsNotAllWhiteSpaceString: boolean | undefined;

  constructor(value: any | null | undefined, trimIfString = false) {
    this.value = value;

    if (trimIfString && this.isOfTypeString) {
      this.value = this.value.trim();
      this.valIsNotAllWhiteSpaceString = this.isNonEmptyString;
    }
  }

  get isUndef(): boolean {
    this.valIsUndef = this.valIsUndef ?? typeof this.value === "undefined";
    return this.valIsUndef;
  }

  get isNull(): boolean {
    this.valIsNull = this.valIsNull ?? this.value === null;
    return this.valIsNull;
  }

  get isNaN(): boolean {
    this.valIsNaN = this.valIsNaN ?? isNaN(this.value);
    return this.valIsNaN;
  }

  get isOfTypeBool(): boolean {
    this.valIsOfTypeBool =
      this.valIsOfTypeBool ?? typeof this.value === "boolean";
    return this.valIsOfTypeBool;
  }

  get isOfTypeString(): boolean {
    this.valIsOfTypeString =
      this.valIsOfTypeString ?? typeof this.value === "string";
    return this.valIsOfTypeString;
  }

  get isOfTypeObject(): boolean {
    this.valIsOfTypeObject =
      this.valIsOfTypeObject ?? typeof this.value === "object";
    return this.valIsOfTypeObject;
  }

  get isOfTypeNumber(): boolean {
    this.valIsOfTypeNumber =
      this.valIsOfTypeNumber ?? typeof this.value === "number";
    return this.valIsOfTypeNumber;
  }

  get isOfTypeBigint(): boolean {
    this.valIsOfTypeBigint =
      this.valIsOfTypeBigint ?? typeof this.value === "bigint";
    return this.valIsOfTypeBigint;
  }

  get isOfTypeSymbol(): boolean {
    this.valIsOfTypeSymbol =
      this.valIsOfTypeSymbol ?? typeof this.value === "symbol";
    return this.valIsOfTypeSymbol;
  }

  get isNullOrUndef(): boolean {
    const retVal = this.isNull || this.isUndef;
    return retVal;
  }

  get isNullOrUndefOrNaN(): boolean {
    const retVal = this.isNull || this.isUndef || this.isNaN;
    return retVal;
  }

  get isNotNullObj(): boolean {
    const retVal = !this.isNull && this.isOfTypeObject;
    return retVal;
  }

  get isNotNaNNumber(): boolean {
    const retVal = this.isOfTypeNumber && !this.isNaN;
    return retVal;
  }

  get isNonEmptyString(): boolean {
    this.valIsNonEmptyString =
      this.valIsNonEmptyString ?? (this.isOfTypeString && this.value !== "");

    return this.valIsNonEmptyString;
  }

  get isNotAllWhiteSpaceString(): boolean {
    this.valIsNotAllWhiteSpaceString =
      this.valIsNotAllWhiteSpaceString ??
      (this.isNonEmptyString && this.value.trim() !== "");

    return this.valIsNotAllWhiteSpaceString;
  }

  is(
    predicate: (
      value: any | null | undefined,
      wrapper: ValueWrapper
    ) => boolean | any | null | undefined
  ): boolean {
    const retVal = predicate(this.value, this);
    const boolRetVal = !!retVal;

    return boolRetVal;
  }
}

export class TrmrkCore {
  dblSpace = "  ";
  dblBackSlash = "\\\\";
  quoteChars: IStrHash = {
    '"': '\\"',
    "'": "\\'",
  };

  javascriptVoid = "javascript:void(0);";

  withVal(
    value: any | null | undefined,
    callback: (val: any | null | undefined) => any | null | undefined | void
  ) {
    const retVal = callback(value);
    return retVal;
  }

  escapeQuote(strVal: string, qStr: '"' | "'" = '"') {
    strVal = strVal.replaceAll("\\", this.dblBackSlash);
    const replQ = this.quoteChars[qStr];

    strVal = strVal.replaceAll(qStr, replQ);
    return strVal;
  }

  escapeHtml(strVal: string) {
    strVal = strVal
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

    return strVal;
  }

  firstLetterToLowerCase(strVal: string) {
    strVal = strVal[0].toLowerCase() + strVal.substring(1);
    return strVal;
  }

  firstLetterToUpperCase(strVal: string) {
    strVal = strVal[0].toUpperCase() + strVal.substring(1);
    return strVal;
  }

  numberIs(
    value: number | any | null | undefined,
    callback: (val: number) => boolean,
    defaultValue = false
  ) {
    let retVal = defaultValue;

    if (new ValueWrapper(value).isNotNaNNumber) {
      retVal = callback(value);
    }

    return retVal;
  }

  numbersAre(
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    callback: (trgVal: number, srcVal: number) => boolean
  ) {
    const retValue = this.numberIs(trgValue, (trgVal) =>
      this.numberIs(srcValue, (srcVal) => callback(trgVal, srcVal), true)
    );

    return retValue;
  }

  numberIsGreaterThan(
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    strictlyGreatherThan = false
  ) {
    const retValue = this.numbersAre(trgValue, srcValue, (trgVal, srcVal) => {
      let retVal: boolean;

      if (strictlyGreatherThan) {
        retVal = trgVal > srcVal;
      } else {
        retVal = trgVal >= srcVal;
      }

      return retVal;
    });

    return retValue;
  }

  numberIsLessThan(
    trgValue: number | any | null | undefined,
    srcValue: number | any | null | undefined,
    strictlyLessThan = false
  ) {
    const retValue = this.numbersAre(trgValue, srcValue, (trgVal, srcVal) => {
      let retVal: boolean;

      if (strictlyLessThan) {
        retVal = trgVal < srcVal;
      } else {
        retVal = trgVal <= srcVal;
      }

      return retVal;
    });

    return retValue;
  }

  numberIsInRange(
    value: number | any | null | undefined,
    min: number | null = null,
    max: number | null = null,
    strictlyGreatherThan = false,
    strictlyLessThan = false
  ) {
    let retVal = this.numberIsGreaterThan(value, min, strictlyGreatherThan);
    retVal = retVal && this.numberIsLessThan(value, min, strictlyLessThan);

    return retVal;
  }
}
