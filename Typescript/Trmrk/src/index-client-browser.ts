import { Trmrk, TrmrkClientBrowserApp } from './main-client-browser';

export const trmrk = new Trmrk();
export const app = new TrmrkClientBrowserApp();

trmrk.app = app;
(window as any).trmrk = trmrk;