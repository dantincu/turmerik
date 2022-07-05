import { trmrk } from './core.js';

export const copyProps = (trg, src, throwOnUnknownProp = false) => {
    let retVal = src !== null && typeof src === "object";

    if (retVal) {
        const srcProps = Object.keys(src);
        const ownProps = Object.keys(trg);

        for (let prop of srcProps) {
            if (throwOnUnknownProp && ownProps.indexOf(prop) < 0) {
                var err = "Unknown prop: " + prop;
                throw err;
            } else {
                trg[prop] = src[prop];
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
