import { TrmrkCore } from "../core/core";

export class TrmrkClientBrowser {
  constructor(public core: TrmrkCore) {}
}

export class TrmrkClientBrowserApp {
  constructor(public browser: TrmrkClientBrowser) {}
}
