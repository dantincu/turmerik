import { DomElWrapperBase } from './DomElWrapperBase.js';

export class DomHelper extends DomElWrapperBase {
    Selector;

    __domElms;

    constructor(domElId, selector) {
        super(domElId);

        if (!domElId && !selector) {
            throw new Error("Must specify either an id or a selector (or both )");
        }

        this.Selector = selector;
    }

    get DomElms() {
        this.__domElms = this.__domElms || this.GetDomElms();
        return this.__domElms;
    }

    GetDomEl() {
        let domEl = super.GetDomEl() || document;

        if (this.Selector) {
            domEl = domEl.querySelector(this.Selector);
        }

        return domEl;
    }

    GetDomElms() {
        let domElms = super.GetDomEl() || document;

        if (this.Selector) {
            domElms = domElms.querySelectorAll(this.Selector);
        }

        return domElms;
    }
}