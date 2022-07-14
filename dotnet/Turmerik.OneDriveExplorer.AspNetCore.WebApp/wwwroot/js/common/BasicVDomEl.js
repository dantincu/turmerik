import { trmrk, ViewModelBase } from './core.js';
import { VDomEl } from './vdom.js';

export class BasicVDomElOpts extends ViewModelBase {
    nodeName;
    classList;
    attrs;

    constructor(src) {
        super();
        this.assignProps(src);
    }

    assignProps(src) {
        this.__copyProps(src);
    }
}

export class BasicVDomEl extends VDomEl {
    opts;

    constructor(opts) {
        super({
            nodeName: opts.nodeName,
            classList: opts.classList,
            attrs: opts.attrs
        });

        this.assignOpts(opts);
        this.init();
    }

    assignOpts(opts) {
        this.opts = new BasicVDomElOpts(opts);
    }

    init() {}

    getVDomElCore(classList, childNodes, nodeName = "div") {
        const vDomEl = vdom.utils.getVDomEl(nodeName,
            classList, {}, childNodes);
        
        return vDomEl;
    }
}