import { TextVDomElOpts, TextVDomEl } from './TextVDomEl.js';

export class BsButtonVDomElOpts extends TextVDomElOpts {
    assignProps(src) {
        this.__copyProps(src);

        this.nodeName = this.nodeName ?? "button";

        this.attrs = this.attrs ?? {
            type: "button"
        }
    }
}

export class BsButtonVDomEl extends TextVDomEl {
    assignOpts(opts) {
        this.opts = new BsButtonVDomElOpts(opts);
    }
}