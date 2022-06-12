import { trmrk } from './core.js';

export class ViewModelBase {
    __copyProps(src, throwOnUnknownProp = false) {
        let retVal = src !== null && typeof src === "object";

        if (retVal) {
            const srcProps = Object.keys(src);
            const ownProps = Object.keys(this);

            for (let prop of srcProps) {
                if (throwOnUnknownProp && ownProps.indexOf(prop) < 0) {
                    var err = "Unknown prop: " + prop;
                    throw err;
                } else {
                    this[prop] = src[prop];
                }
            }
        }

        return retVal;
    }
}

trmrk.types["ViewModelBase"] = ViewModelBase;
