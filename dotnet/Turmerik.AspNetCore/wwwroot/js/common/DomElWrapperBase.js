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

        if (this.DomElId) {
            domEl = document.getElementById(this.DomElId);
        }

        return domEl;
    }
}