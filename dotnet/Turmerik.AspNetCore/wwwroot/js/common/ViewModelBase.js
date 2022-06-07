import { trmrk } from './core.js';

export class ViewModelBase {
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

export class Exception extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    StackTrace = null;
    Source = null;
    Message = null;
}

export class ErrorViewModel extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    Message = null;
    Exception = null;
    PrintExcStackTrace = null;
}

export class TrmrkActionResult extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    IsSuccess = null;
    ErrorViewModel = null;
    HttpStatusCode = null;
    Data = null;
}

trmrk.types["EntityBase"] = ViewModelBase;
trmrk.types["Exception"] = Exception;
trmrk.types["ErrorViewModel"] = ErrorViewModel;
trmrk.types["TrmrkActionResult"] = TrmrkActionResult;
