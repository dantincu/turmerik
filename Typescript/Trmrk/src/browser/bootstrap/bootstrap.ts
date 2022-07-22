import { TrmrkClientBrowser, TrmrkClientBrowserApp } from "../browser";

export class TrmrkBootStrap {
  constructor(public browser: TrmrkClientBrowser) {}
}

export class TrmrkBootstrapApp extends TrmrkClientBrowserApp {
  constructor(public bsBrowser: TrmrkBootStrap, browser: TrmrkClientBrowser) {
    super(browser);
  }
}
