const trmrk = {
    throw: (err) => {
        if (typeof (err) !== "object") {
            err = new Error(err);
        }

        throw err;
    },
    readFromClipboardAsync: async () => {
        let text = await navigator.clipboard.readText();
        return text;
    },
    writeToClipboardAsync: async (text) => {
        await navigator.clipboard.writeText(text);
    },
    isLoggingEnabled: false,
    log: function() {
        if (trmrk.isLoggingEnabled) {
            console.log.apply(window, arguments);
        }
    },
    strTrimStart: (str, strToTrim) => {
        while (str.startsWith(strToTrim)) {
            str = str.substring(strToTrim.length);
        }

        return str;
    },
    strTrimEnd: (str, strToTrim) => {
        while (str.endsWith(strToTrim)) {
            str = str.substring(0, str.length - strToTrim.length);
        }

        return str;
    },
    cacheKeyBasePrefix: "trmrk"
}

class EntityBase {
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

window.Trmrk = trmrk;
window.EntityBase = EntityBase;

export const Trmrk = trmrk;