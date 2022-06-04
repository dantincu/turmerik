export class TrmrkCore {
    isLoggingEnabled = false;
    cacheKeyBasePrefix = "trmrk";

    urlQuery = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    
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

    valueIsNotUndefined(value) {

    };

    objectsEqualShallow(trg, ref) {
        let equal = trg === ref;

        if (!equal && typeof(trg) === "object" && typeof(ref) === "object" && trg !== null && ref !== null) {
            
        }
    };

    textToLines (text, maxLineLen) {
        let lines = [];
        let textLen = text.length;

        let linesCount = Math.ceil(textLen / maxLineLen);

        let stIdx = 0;
        let endIdx = maxLineLen - 1;

        for (let i = 0; i < linesCount; i++) {
            lines[i] = text.substring(stIdx, endIdx);

            stIdx = endIdx;
            endIdx += maxLineLen;
        }

        return lines;
    }
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