import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { BasicVDomElProps } from './domUtils.js';
import { bsDomUtils, domUtils } from './main.js';
import { vdom, VDomEl, VDomTextNode } from './vdom.js';
import { TrmrkAxiosApiResult } from './trmrkAxios.js';
import { BasicVDomElOpts, BasicVDomEl } from './BasicVDomEl.js';
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