export interface IRefValue<TValue> {
    value : TValue | null | undefined;
}

export interface IKeyValuePair<TKey, TValue> extends IRefValue<TValue> {
    key: TKey;
}

export type StrHashKeyType<TValue> = {
    [key: string] : TValue;
}

export type NumHashKeyType<TValue> = {
    [key: number] : TValue;
}

export type HashKeyType<TValue> = StrHashKeyType<TValue> | NumHashKeyType<TValue>;

export interface IHash<TValue> {
    [key: string] : TValue;
}

export type HashType<TKey extends HashKeyType<TValue>, TValue> = {
    [key in keyof TKey] : TValue;
}

export interface IStrHash extends IHash<string> {
}

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
        this.valIsUndef = this.valIsUndef ?? typeof(this.value) === "undefined";
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
        this.valIsOfTypeBool = this.valIsOfTypeBool ?? typeof(this.value) === "boolean";
        return this.valIsOfTypeBool;
    }

    get isOfTypeString(): boolean {
        this.valIsOfTypeString = this.valIsOfTypeString ?? typeof(this.value) === "string";
        return this.valIsOfTypeString;
    }

    get isOfTypeObject(): boolean {
        this.valIsOfTypeObject = this.valIsOfTypeObject ?? typeof(this.value) === "object";
        return this.valIsOfTypeObject;
    }

    get isOfTypeNumber(): boolean {
        this.valIsOfTypeNumber = this.valIsOfTypeNumber ?? typeof(this.value) === "number";
        return this.valIsOfTypeNumber;
    }

    get isOfTypeBigint(): boolean {
        this.valIsOfTypeBigint = this.valIsOfTypeBigint ?? typeof(this.value) === "bigint";
        return this.valIsOfTypeBigint;
    }

    get isOfTypeSymbol(): boolean {
        this.valIsOfTypeSymbol = this.valIsOfTypeSymbol ?? typeof(this.value) === "symbol";
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
        this.valIsNonEmptyString = this.valIsNonEmptyString ?? (
            this.isOfTypeString && this.value !== "");

        return this.valIsNonEmptyString;
    }

    get isNotAllWhiteSpaceString(): boolean {
        this.valIsNotAllWhiteSpaceString = this.valIsNotAllWhiteSpaceString ?? (
            this.isNonEmptyString && this.value.trim() !== "");
        
        return this.valIsNotAllWhiteSpaceString;
    }

    is(predicate: (
        value: any | null | undefined,
        wrapper: ValueWrapper) => boolean | any | null | undefined): boolean {
        let retVal = predicate(this.value, this);
        const boolRetVal = !(!retVal);

        return boolRetVal;
    }
}

export class TrmrkCore {
    dblSpace = "  ";
    dblBackSlash = "\\\\";
    quoteChars: IStrHash = {
        '"': '\\"',
        "'": "\\'"
    };

    withVal(value: any | null | undefined,
        callback: (val: any | null | undefined) => any | null | undefined | void) {
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
        strVal = strVal.replaceAll(
            '&', '&amp;').replaceAll(
            '<', '&lt;').replaceAll(
            '>', '&gt;').replaceAll(
            '"', '&quot;').replaceAll(
                "'", '&#039;');
        
        return strVal;
    }
}

