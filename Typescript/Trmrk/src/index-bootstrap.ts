import { Trmrk, TrmrkBootstrapApp } from './main-bootstrap';

export const trmrk = new Trmrk();
export const app = new TrmrkBootstrapApp();

trmrk.app = app;
(window as any).trmrk = trmrk;