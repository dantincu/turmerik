import { trmrk } from './core.js';

export class DomElWrapperBase {

    DomElId;

    __domEl;

    constructor(domElId) {
        this.DomElId = domElId;
    }

    get DomEl() {
        this.__domEl = this.__domEl || this.GetDomEl();
        return this.__domEl;
    }

    GetDomEl() {
        let domEl;
        let domElIdType = typeof(this.DomElId);

        if (domElIdType === "string") {
            domEl = document.getElementById(this.DomElId);
        } else if (domElIdType === "object") {
            domEl = this.DomElId;
        }

        return domEl;
    }
}

trmrk.types["DomElWrapperBase"] = DomElWrapperBase;