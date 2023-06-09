﻿export const copyProps = (trg, src,
    throwOnUnknownProp = false,
    skipNullOrUndefOrNaNValues = false,
    throwIfSrcIsNullOrUndef = false,
    onlyCopyKnownProps = false) => {
    let retVal = src !== null && typeof src === "object";

    if (retVal) {
        const srcProps = Object.keys(src);
        const ownProps = Object.keys(trg);

        for (let prop of srcProps) {
            let propVal = src[prop];
            let copyProp = !skipNullOrUndefOrNaNValues || !trmrk.core.isNullOrUndefOrOrNaN(propVal)

            if (ownProps.indexOf(prop) < 0) {
                if (throwOnUnknownProp) {
                    var err = "Unknown prop: " + prop;
                    throw err;
                } else if (onlyCopyKnownProps) {
                    copyProp = false;
                }
            }

            if (copyProp) {
                trg[prop] = propVal;
            }
        }
    } else if (throwIfSrcIsNullOrUndef) {
        var err = "Source must be a not null object";
        throw err;
    }

    return retVal;
}

export class ViewModelBase {
    __copyProps(src, throwOnUnknownProp = false, throwIfSrcIsNullOrUndef = false, onlyCopyKnownProps = false) {
        let retVal = copyProps(this, src, throwOnUnknownProp, true, throwIfSrcIsNullOrUndef, onlyCopyKnownProps);
        return retVal;
    }
}

export class StrIndentOpts extends ViewModelBase {
    indent;
    indentStr;

    constructor(src) {
        super();
        this.__copyProps(src, true, true);
        this.indentStr = trmrk.core.strValOrDefault(trmrk.core.dblSpace);

        if (!trmrk.core.isNotNaNNumber(this.indent)) {
            this.indent = !(this.indent);
        }
    }
}

export class ValueWrapper {
    value;

    constructor(value) {
        this.value = value;
        this.type = typeof(value);
    }
}

export class ExtendedValueWrapper extends ValueWrapper {
    type = "";

    __isNull = null;
    __isUndef = null;
    __isObj = null;
    __isFunc = null;
    __isBool = null;
    __isString = null;
    __isNumber = null;
    __isNaN = null;

    constructor(value) {
        super(value);
        this.type = typeof(value);
    }

    get isNull() {
        this.__isNull = this.__isNull ?? this.value === null;
        return this.__isNull;
    }

    get isUndef() {
        this.__isUndef = this.__isUndef ?? this.type === "undefined";
        return this.__isUndef;
    }

    get isObj() {
        this.__isObj = this.__isObj ?? this.type === "object";
        return this.__isObj;
    }

    get isFunc() {
        this.__isFunc = this.__isFunc ?? this.type === "function";
        return this.__isFunc;
    }

    get isBool() {
        this.__isBool = this.__isBool ?? this.type === "boolean";
        return this.__isBool;
    }

    get isString() {
        this.__isString = this.__isString ?? this.type === "string";
        return this.__isString;
    }

    get isNumber() {
        this.__isNumber = this.__isNumber ?? this.type === "number";
        return this.__isNumber;
    }

    get isNaN() {
        this.__isNaN = this.__isNaN ?? (isNumber && isNaN(this.type));
        return this.__isNaN;
    }

    get isNullOrUndef() {
        let retVal = this.isNull || this.isUndef;
        return retVal;
    }

    get isNotNaNNumber() {
        let retVal = this.isNumber && !this.isNaN;
        return retVal;
    }

    get isNonEmptyString() {
        let retVal = this.isString && this.value.length > 0;
        return retVal;
    }
}

export class KeyValuePair {
    key;
    value;

    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

export class TrmrkCore {
    bckSlash = '\\';
    dblBckSlash = '\\';
    dblSpace = "  ";
    escapedQuotes = {
        '"': '\\"',
        "'": "\\'"
    }

    javascriptVoid = "javascript:void(0);"
    isLoggingEnabled = false;
    trmrkPrefix = "trmrk";
    longPressMillis = 400;

    urlQuery = new URLSearchParams(window.location.search);

    navigate(urlSearchParams, inNewTab, pathname, host, https, data, unused) {
        let search = "";
        let scheme = window.location.protocol;

        if (https === false) {
            scheme = "http:";
        }
        
        if (this.isNotNullObj(urlSearchParams)) {
            search = urlSearchParams.toString().trim();
        } else if (trmrk.core.isNonEmptyString(urlSearchParams)) {
            search = urlSearchParams.trim();
        }

        if (trmrk.core.isNonEmptyString(search)) {
            if (!search.startsWith("?")) {
                search = "?" + search;
            }
        }

        if (!this.isNonEmptyString(pathname)) {
            pathname = window.location.pathname;
        }

        if (pathname.startsWith('/')) {
            pathname = pathname.substring(1);
        }

        if (!this.isNonEmptyString(host)) {
            host = window.location.host;

            if (https !== false) {
                scheme = window.location.protocol;
            }
        }

        let relUrl = pathname + search;
        let url = scheme + "//" + host + '/' + relUrl;
        
        if (inNewTab === true) {
            window.open(url);
        } else if (this.isOfTypeBoolean(inNewTab)) { // is explicitly set to false
            window.history.pushState(data, unused, relUrl);
        } else {
            window.location.assign(url);
        }
    }
    
    throw (err) {
        if (typeof (err) !== "object") {
            err = new Error(err);
        }

        throw err;
    };

    isIterable(obj) {
        const retVal = typeof obj[Symbol.iterator] === 'function';
        return retVal;
    }

    async readFromClipboardAsync() {
        let text = await navigator.clipboard.readText();
        return text;
    };

    async writeToClipboardAsync(text) {
        await navigator.clipboard.writeText(text);
    };

    log() {
        if (trmrkInstn.isLoggingEnabled) {
            console.log.apply(window, arguments);
        }
    };

    trimStrIfNotNull(value) {
        if (this.isNonEmptyString(value)) {
            value = value.trim();
        } else {
            value = null;
        }
    }

    strTrimStart(str, strToTrim) {
        while (str.startsWith(strToTrim)) {
            str = str.substring(strToTrim.length);
        }

        return str;
    };

    strTrimEnd(str, strToTrim) {
        while (str.endsWith(strToTrim)) {
            str = str.substring(0, str.length - strToTrim.length);
        }

        return str;
    };

    tryParseJson(jsonStr, retSrcStrOnFail) {
        let retVal;

        if (this.isNonEmptyString(jsonStr)) {
            jsonStr = jsonStr.trim();

            try {
                let obj = JSON.parse(jsonStr);
                retVal = obj;
            } catch (err) {
                if (retSrcStrOnFail) {
                    retVal = jsonStr;
                } else {
                    retVal = null;
                }
            }
        } else {
            retVal = null;
        }

        return retVal;
    }

    toJsonIfObj(value) {
        if (this.isNotNullObj(value)) {
            value = this.clone(value, true);
            value = JSON.stringify(value);
        }

        return value;
    }

    isOfTypeString(value) {
        let retVal = typeof(value) === "string";
        return retVal;
    }

    isOfTypeNumber(value) {
        let retVal = typeof(value) === "number";
        return retVal;
    }

    isOfTypeBoolean(value) {
        let retVal = typeof(value) === "boolean";
        return retVal;
    }

    isOfTypeObject(value) {
        let retVal = typeof(value) === "object";
        return retVal;
    }

    isOfTypeFunction(value) {
        let retVal = typeof(value) === "function";
        return retVal;
    }

    /// calling isNaN with undefined or non-empty string as argument returns true
    isNaN(value) {
        let retVal = typeof(value) === "number";
        retVal = retVal && this.isNaN(value);

        return retVal;
    }

    isUndef(value) {
        let retVal = typeof(value) === "undefined";
        return retVal;
    };

    isNullOrUndef(value) {
        let retVal = value === null;
        retVal = retVal || typeof(value) === "undefined";

        return retVal;
    }

    isNullOrUndefOrEmptyStr(value) {
        let retVal = value === null;

        if (!retVal) {
            let valueType = typeof(value);
            retVal = retVal || valueType === "undefined";

            retVal = retVal || (valueType === "string" && value.length == 0);
        }

        return retVal;
    }

    isNullOrUndefOrOrNaN(value) {
        let retVal = value === null;

        if (!retVal) {
            let valueType = typeof(value);
            retVal = retVal || valueType === "undefined";

            retVal = retVal || (valueType === "number" && isNaN(value));
        }

        return retVal;
    }

    isNullOrUndefOrEmptyStrOrNaN(value) {
        let retVal = value === null;

        if (!retVal) {
            let valueType = typeof(value);
            retVal = retVal || valueType === "undefined";

            retVal = retVal || (valueType === "string" && value.length == 0);
            retVal = retVal || (valueType === "number" && isNaN(value));
        }

        return retVal;
    }

    isNotNullObj(value) {
        let retVal = typeof(value) === "object";
        retVal = retVal && value !== null;

        return retVal;
    }

    isNotNaNNumber(value) {
        let retVal = typeof(value) === "number";
        retVal = retVal && !isNaN(value);

        return retVal;
    }

    isNonEmptyString(value, mustNotBeAllWhiteSpace = false) {
        let retVal = typeof(value) === "string" && value.length > 0;

        if (retVal && mustNotBeAllWhiteSpace) {
            value = value.trim();
            retVal = value.length > 0;
        }

        return retVal;
    }

    isLetter(char) {
        const retVal = char.toLowerCase() != char.toUpperCase();
        return retVal;
    }

    foreach(src, callbacksArr) {
        let keysArr = Object.keys(src);

        for (let key of keysArr) {
            let value = src[key];
            let keep = true;

            for (let i = 0; i < callbacksArr.length; i++) {
                let func = callbacksArr[i];

                if (i % 2 === 0) {
                    if (typeof(func) !== "function") {
                        func = (v, k) => true;
                    }

                    keep = keep && func(value, key);
                } else if (keep) {
                    if (typeof(func) !== "function") {
                        func = (v, k) => v;
                    }

                    value = func(value, key);
                }
            }
        }
    }

    filterMap(src, callbacksArr) {
        let trg = {};

        if (this.isIterable(src)) {
            trg = [];
        }

        if (callbacksArr.length % 2 == 1) {
            callbacksArr.push(null);
        }

        callbacksArr.push((value, key) => {
            trg[key] = value;
        });

        this.foreach(src, callbacksArr);
        return trg;
    }

    clone(src, deep) {
        let convertor;

        if (deep) {
            convertor = value => typeof(value) === "object" ? this.clone(value, deep) : value;
        } else {
            convertor = value => value;
        }

        let trg = this.filterMap(
            src, [
            value => !this.isNullOrUndefOrOrNaN(value),
            convertor
        ]);

        return trg;
    }

    assureIsObject(obj, throwIfObjIsNull, defaultValueIsArray) {
        if (this.isNullOrUndef(obj)) {
            if (throwIfObjIsNull) {
                throw "Provided value must not be null or undefined"
            } else {
                if (defaultValueIsArray) {
                    obj = [];
                } else {
                    obj = {};
                }
            }
        } else if (typeof(obj) !== "object") {
            throw "Provided value must be an object";
        }

        return obj;
    }

    merge(trg, src, deep) {
        trg = this.assureIsObject(trg, false, this.isIterable(src));

        this.foreach(src, [
            value => !this.isNullOrUndefOrOrNaN(value),
            (srcVal, key) => {
                let trgVal = trg[key];
                
                if (this.isNullOrUndefOrOrNaN(trgVal)) {
                    if (this.isOfTypeObject(srcVal)) {
                        trgVal = this.clone(srcVal, deep);
                    } else {
                        trgVal = srcVal;
                    }

                    trg[key] = srcVal;
                } else if (this.isOfTypeObject(
                    trgVal) && this.isOfTypeObject(srcVal)) {
                    this.merge(trgVal, srcVal, deep);
                }
            }
        ]);

        return trg;
    }

    mergeAll(trg, srcArr, deep) {
        for (let src of srcArr) {
            trg = this.merge(trg, src, deep);
        }

        return trg;
    }

    getDeepComparisonEqPred(ref, ignoreEmpyValues) {
        let equalityPredicate = (value, key) => {
            let refValue = ref[key];
            let retVal = refValue === value;

            if (!retVal) {
                let trgWrppr = new ExtendedValueWrapper(value);
                let refWrppr = new ExtendedValueWrapper(ref[key]);

                if (trgWrppr.isNullOrUndef && refWrppr.isNullOrUndef) {
                    retVal = ignoreEmpyValues;
                } else if (trgWrppr.isObj && refWrppr.isObj) {
                    let childEqPredicate = this.getEqualityPredicate(
                        refValue,
                        deepComparison,
                        ignoreEmpyValues);

                    retVal = this.objectsEqual(value, refValue, childEqPredicate);
                }
            }

            return retVal;
        };

        return equalityPredicate;
    }

    getEqualityPredicate(ref, deepComparison, ignoreEmpyValues) {
        let equalityPredicate;

        if (deepComparison) {
            equalityPredicate = this.getDeepComparisonEqPred(ref, ignoreEmpyValues);
        } else {
            if (ignoreEmpyValues) {
                equalityPredicate = (value, key) => {
                    let refValue = ref[key];
                    let retVal = refValue === value;

                    if (!retVal) {
                        retVal = this.isNullOrUndefOrOrNaN(value) && this.isNullOrUndefOrOrNaN(refVal);
                    }

                    return retVal;
                }
            } else {
                equalityPredicate = (value, key) => value === ref[key];
            }
        }

        return equalityPredicate;
    }

    objectsEqual(trg, ref, equalityPredicate, ignoreEmpyValues) {
        this.assureIsObject(trg, true);
        this.assureIsObject(ref, true);
        
        let retVal = trg === ref;

        if (!retVal) {
            ignoreEmpyValues = !(!ignoreEmpyValues);

            if (typeof(equalityPredicate) !== "function") {
                let deepComparison = !(!equalityPredicate);
                equalityPredicate = this.getEqualityPredicate(deepComparison, ignoreEmpyValues);
            }

            this.foreach(src, [
                null,
                (value, key) => {
                    retVal = retVal && equalityPredicate(value, ref[key]);
                }
            ]);
        }
        
        return retVal;
    };

    bindFuncOrNoop(func, target) {
        if (this.isOfTypeFunction(func)) {
            func = func.bind(target);
        } else {
            func = (function() {}).bind(target);
        }

        return func;
    }

    bindFuncOrDefault(func, target, defaultFunc) {
        if (this.isOfTypeFunction(func)) {
            func = func.bind(target);
        } else {
            func = defaultFunc.bind(target);
        }

        return func;
    }

    getFuncOrNoop(func) {
        if (!this.isOfTypeFunction(func)) {
            func = function() {};
        }

        return func;
    }

    getFuncOrDefault(func, defaultFunc) {
        if (!this.isOfTypeFunction(func)) {
            func = defaultFunc;
        }

        return func;
    }

    valOrNull(value) {
        if (this.isUndef(value)) {
            value = null;
        }

        return value;
    }

    valOrDefault(value, defaultValue) {
        if (this.isNullOrUndef(value)) {
            value = defaultValue;
        }

        return value;
    }

    getValOrNull(value, isNotNullPred) {
        if (!isNotNullPred(value)) {
            value = null;
        }

        return value;
    }

    getValOrDefault(value, isNotNullPred, defaultValue) {
        if (!isNotNullPred(value)) {
            value = defaultValue;
        }

        return value;
    }

    getValueOrDefault(value, isNotNullPred, defaultValueFactory) {
        if (!isNotNullPred(value)) {
            value = defaultValueFactory();
        }

        return value;
    }

    objValOrNull(value) {
        if (!this.isNotNullObj(value)) {
            value = null;
        }

        return value;
    }

    objValOrDefault(value, defaultValue) {
        if (!this.isNotNullObj(value)) {
            value = defaultValue;
        }

        return value;
    }

    objValueOrDefault(value, defaultValueFactory) {
        if (!this.isNotNullObj(value)) {
            value = defaultValueFactory();
        }

        return value;
    }

    strValOrNull(value) {
        if (!this.isOfTypeString(value)) {
            value = null;
        }

        return value;
    }

    strValOrDefault(value, defaultValue) {
        if (!this.isOfTypeString(value)) {
            value = defaultValue;
        }

        return value;
    }

    strValueOrDefault(value, defaultValueFactory) {
        if (!this.isOfTypeString(value)) {
            value = defaultValueFactory();
        }

        return value;
    }

    nonEmptyStrValOrNull(value) {
        if (!this.isNonEmptyString(value)) {
            value = null;
        }

        return value;
    }

    nonEmptyStrValOrDefault(value, defaultValue) {
        if (!this.isNonEmptyString(value)) {
            value = defaultValue;
        }

        return value;
    }

    nonEmptyStrValueOrDefault(value, defaultValueFactory) {
        if (!this.isNonEmptyString(value)) {
            value = defaultValueFactory();
        }

        return value;
    }

    getNonEmptyStrValOrNull(value, nonEmptyTransformer) {
        if (this.isNonEmptyString(value)) {
            value = nonEmptyTransformer(value);
        } else {
            value = null;
        }

        return value;
    }

    getNonEmptyStrValOrEmpty(value, nonEmptyTransformer) {
        if (this.isNonEmptyString(value)) {
            value = nonEmptyTransformer(value);
        } else {
            value = "";
        }

        return value;
    }

    getNonEmptyStrValOrDefault(value, nonEmptyTransformer, defaultValue) {
        if (this.isNonEmptyString(value)) {
            value = nonEmptyTransformer(value);
        } else {
            value = defaultValue;
        }

        return value;
    }

    getNonEmptyStrValueOrDefault(value, nonEmptyTransformer, defaultValueFactory) {
        if (this.isNonEmptyString(value)) {
            value = nonEmptyTransformer(value);
        } else {
            value = defaultValueFactory();
        }

        return value;
    }

    toStringOrDefault(value, defaultValue) {
        let strVal = value;

        if (this.isNullOrUndefOrOrNaN(value)) {
            strVal = defaultValue;
        } else if (!this.isOfTypeString(value)) {
            strVal = value.toString();
        }

        return strVal;
    }

    toNonEmptyStringOrDefault(value, defaultValue) {
        let retVal = this.toStringOrDefault(value).trim();
        retVal = this.nonEmptyStrValOrDefault(retVal, defaultValue);

        return retVal;
    }

    toString(value) {
        let strVal = this.toStringOrDefault(value, "");
        return strVal;
    }

    toStringOrNull(value) {
        let strVal = this.toStringOrDefault(value, null);
        return strVal;
    }

    stringsEqualIgnoreCase(trgStr, refStr) {
        let retVal = trgStr === refStr;

        if (!retVal) {
            trgStr = trgStr.toLowerCase();
            refStr = refStr.toLowerCase();

            retVal = trgStr === refStr;
        }

        return retVal;
    }

    numOrNull(value) {
        if (!this.isNotNaNNumber(value)) {
            value = null;
        }

        return value;
    }

    numOrDefault(value, defaultValue) {
        if (!this.isNotNaNNumber(value)) {
            value = defaultValue;
        }

        return value;
    }

    numberOrDefault(value, defaultValueFactory) {
        if (!this.isNotNaNNumber(value)) {
            value = defaultValueFactory();
        }

        return value;
    }

    firstOrDefault(arr, predicate = null, reverseKeys = false) {
        let retVal = new KeyValuePair(-1);
        predicate = predicate ?? ((val, idx) => true);

        let keys = Object.keys(arr);

        if (reverseKeys) {
            keys = keys.reverse();
        }

        for (let i in keys) {
            let val = arr[i];

            if (predicate(val, i)) {
                retVal.key = i;
                retVal.value = val;

                break;
            }
        }

        return retVal;
    }

    applyIfOfTypeFunc(callback, target, argsArr) {
        if (this.isOfTypeFunction(callback)) {
            callback.apply(target, argsArr);
        }
    }

    paddStr(str, minLen, paddChar) {
        const startsWithPadd = minLen < 0;
        minLen = Math.abs(minLen);
        
        while (str.length < minLen) {
            if (startsWithPadd) {
                str = paddChar + str;
            } else {
                str += paddChar;
            }
        }

        return str;
    }

    strJoin(strArr, joinStr = "", testForNullOrUndef = false) {
        const predicate = this.getStrJoinReducePredicate(
            joinStr, testForNullOrUndef);

        const retStr = strArr.reduce(predicate);
        return retStr;
    }

    getStrJoinReducePredicate(joinStr, testForNullOrUndef) {
        let predicate;

        if (testForNullOrUndef) {
            if (joinStr === "") {
                predicate = (prev, next) => (prev ?? "") + (next ?? "");
            } else {
                predicate = (prev, next) => (prev ?? "") + joinStr + (next ?? "");
            }
        } else {
            if (joinStr === "") {
                predicate = (prev, next) => prev + next;
            } else {
                predicate = (prev, next) => prev + joinStr + next;
            }
        }

        return predicate;
    }

    withResult(factory, callback) {
        const result = factory();
        callback(result);
    }

    escapeStr(str, rmQ = '"', wrapRetStr = false) {
        const esqRmQ = this.escapedQuotes[rmQ];
        str = str.replaceAll(this.bckSlash, this.dblBckSlash);

        str = str.replaceAll(rmQ, esqRmQ);

        if (wrapRetStr) {
            str = [rmQ, str, rmQ].join("");
        }

        return str;
    }

    range(length, transformer) {
        let retArr = [...Array(length).keys()];

        if (this.isOfTypeFunction(transformer)) {
            retArr = retArr.map(transformer);
        }

        return retArr;
    }

    removeAllNullOrUndefOrEmptyStrOrNaNItems(arr) {
        let i = 0;

        while (i < arr.length) {
            if (this.isNullOrUndefOrEmptyStrOrNaN(arr[i])) {
                arr.splice(i, 1);
            } else {
                i++;
            }
        }

        return arr;
    }

    withVal(value, callback, condition) {
        condition = condition ?? this.isNullOrUndefOrEmptyStrOrNaN;

        if (condition(value)) {
            callback(value);
        }
    }

    escapeHtmlText(text) {
        text = text.replaceAll(
            '&', '&amp;').replaceAll(
            '<', '&lt;').replaceAll(
            '>', '&gt;').replaceAll(
            '"', '&quot;').replaceAll(
                "'", '&#039;');
        
        return text;
    }
};

export class Trmrk {
    core = new TrmrkCore();
    app = null;

    types = {};

    domUtils = null;
    bsDomUtils = null;
    webStorage = null;
    vdom = null;
}

const trmrkInstn = new Trmrk();

trmrkInstn.types["ValueWrapper"] = ValueWrapper;
trmrkInstn.types["ExtendedValueWrapper"] = ExtendedValueWrapper;
trmrkInstn.types["KeyValuePair"] = KeyValuePair;
trmrkInstn.types["Trmrk"] = Trmrk;
trmrkInstn.types["TrmrkCore"] = TrmrkCore;

window.trmrk = trmrkInstn;
export const trmrk = trmrkInstn;