import { trmrk } from './core.js';

export class EntityBase {
    __copyProps(src, throwOnUnknownProp = false) {
        if (src !== null && typeof src === "object") {
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
    }
}

trmrk.types["EntityBase"] = EntityBase;