import { trmrk } from './core.js';

export const copyProps = (trg, src, throwOnUnknownProp = false, skipNullOrUndefOrNaNValues = false) => {
    let retVal = src !== null && typeof src === "object";

    if (retVal) {
        const srcProps = Object.keys(src);
        const ownProps = Object.keys(trg);

        for (let prop of srcProps) {
            let propVal = src[prop];

            if (throwOnUnknownProp && ownProps.indexOf(prop) < 0) {
                var err = "Unknown prop: " + prop;
                throw err;
            } else if (!skipNullOrUndefOrNaNValues || !trmrk.core.isNullOrUndefOrOrNaN(propVal)) {
                trg[prop] = propVal;
            }
        }
    }

    return retVal;
}

export class ViewModelBase {
    __copyProps(src, throwOnUnknownProp = false) {
        let retVal = copyProps(this, src, throwOnUnknownProp);
        return retVal;
    }
}

trmrk.types["ViewModelBase"] = ViewModelBase;
