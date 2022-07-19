import * as bootstrap from 'bootstrap';

import { TrmrkCore } from '../../core/core';
import { TrmrkClientBrowser, TrmrkClientBrowserApp } from '../browser';

export class TrmrkBootStrap {
    core: TrmrkClientBrowser;

    constructor(core: TrmrkClientBrowser) {
        this.core = core;
    }
}

export class TrmrkBootstrapApp extends TrmrkClientBrowserApp {
    bsCore = new TrmrkBootStrap(this.core);
}