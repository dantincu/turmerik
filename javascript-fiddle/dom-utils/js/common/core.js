export class ValueWrapper {
    value;
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
        this.value = value;
        this.type = tyepof(value);
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

export class TrmrkCore {
    isLoggingEnabled = false;
    cacheKeyBasePrefix = "trmrk";

    urlQuery = new URLSearchParams(window.location.search);

    openUrl(urlSearchParams, inNewTab, pathname, host, https) {
        let search = "";
        let scheme = window.location.protocol;

        if (https === false) {
            scheme = "http:";
        }
        
        if (trmrk.core.isNotNullObj(urlSearchParams)) {
            search = urlSearchParams.toString();

            if (trmrk.core.isNonEmptyString(search)) {
                search = "?" + search;
            }
        }

        if (!trmrk.core.isNonEmptyString(pathname)) {
            pathname = window.location.pathname;
        }

        if (!trmrk.core.isNonEmptyString(host)) {
            host = window.location.host;

            if (https !== false) {
                scheme = window.location.protocol;
            }
        }

        let url = scheme + "//" + host + pathname + search;
        
        if (inNewTab) {
            window.open(url);
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

    isNonEmptyString(value) {
        let retVal = typeof(value) === "string" && value.length > 0;
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

        if (callbacksArr.length % 2 == 1) {
            callbacksArr.push(null);
        }

        callbacksArr.push((value, key) => {
            trg[key] = value;
        });

        this.foreach(src, callbacksArr);
        return trg;
    }

    cloneShallow(src) {
        let trg = this.filterMap(
            src, [
            value => !this.isNullOrUndefOrOrNaN(value)
        ]);

        return trg;
    }

    cloneDeep(src) {
        let trg = this.filterMap(
            src, [
            value => !this.isNullOrUndefOrOrNaN(value),
            value => typeof(value) === "object" ? this.cloneDeep(value) : value
        ]);

        return trg;
    }

    assureIsObject(obj, throwIfObjIsNull) {
        if (this.isNullOrUndef(obj)) {
            if (throwIfObjIsNull) {
                throw "Provided value must not be null or undefined"
            } else {
                obj = {};
            }
        } else if (typeof(obj) !== "object") {
            throw "Provided value must be an object";
        }

        return obj;
    }

    merge(trg, src, converter) {
        trg = this.assureIsObject(trg);

        if (typeof(converter) !== "function") {
            let deep = !(!converter);
            
            if (deep) {
                converter = (value, key) => {
                    let retValue = value;

                    if (typeof(value) === "object") {
                        retValue = this.merge({}, value, true);
                    }

                    return retValue;
                }
            } else {
                converter = (value, key) => value;
            }
        }

        this.foreach(src, [
            value => this.isNullOrUndefOrOrNaN(trg[key]) && !this.isNullOrUndefOrOrNaN(value),
            (value, key) => {
                let trgValue = converter(value, key);
                trg[key] = trgValue;
            }
        ]);

        return trg;
    }

    getDeepComparisonEqPred(ref, ignoreEmpyValues) {
        let equalityPredicate = (value, key) => {
            let refValue = ref[key];
            let retVal = refValue === value;

            if (!retVal) {
                let trgWrppr = new ValueWrapper(value);
                let refWrppr = new ValueWrapper(ref[key]);

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
};

export class Trmrk {
    core = new TrmrkCore();
    app = null;

    types = {};

    domUtils = null;
    bsDomUtils = null;
    webStorage = null;
}

export class EntityBase {
    __copyProps(src, throwOnUnknownProp = false) {
        if (src !== null && typeof src === "object") {
            const srcProps = Object.keys(src);
            const ownProps = Object.keys(this);

            for (let idx in srcProps) {
                let prop = srcProps[idx];

                if (throwOnUnknownProp && ownProps.indexOf(prop) < 0) {
                    var err = "Unknown prop: " + prop;
                    throw err;
                } else {
                    this[prop] = src[prop];
                }
            }
        }
    }
}

const trmrkInstn = new Trmrk();

trmrkInstn.types["Trmrk"] = Trmrk;
trmrkInstn.types["TrmrkCore"] = TrmrkCore;
trmrkInstn.types["EntityBase"] = EntityBase;

window.trmrk = trmrkInstn;
export const trmrk = trmrkInstn;