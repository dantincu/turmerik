import { TrmrkCore } from "../../core/core";
import { TrmrkClientBrowser, TrmrkClientBrowserApp } from "../browser";

export class TrmrkBootStrap {
  browser: TrmrkClientBrowser;

  constructor(browser: TrmrkClientBrowser) {
    this.browser = browser;
  }
}

export class TrmrkBootstrapApp extends TrmrkClientBrowserApp {
  bsBrowser = new TrmrkBootStrap(this.browser);
}
