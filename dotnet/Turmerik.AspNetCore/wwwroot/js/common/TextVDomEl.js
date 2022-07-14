import { trmrk, ViewModelBase } from './core.js';
import { VDomEl } from './vdom.js';
import { BasicVDomEl, BasicVDomElOpts } from './BasicVDomEl.js';

export class TextVDomElOpts extends BasicVDomElOpts {
    textValue;

    assignProps(src) {
        this.__copyProps(src);
    }
}

export class TextVDomEl extends BasicVDomEl {
    assignOpts(opts) {
        this.opts = new TextVDomElOpts(opts);
    }

    init() {
        if (trmrk.core.isNonEmptyString(this.opts.textValue)) {
            this.setTextValue(this.opts.textValue);
        }
    }
}