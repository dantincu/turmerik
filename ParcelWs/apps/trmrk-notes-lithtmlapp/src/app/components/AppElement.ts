import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../domUtils/css";
import { initDomAppTheme } from "../../trmrk-lithtml/domUtils/core";

import { Components } from "../../trmrk-lithtml/components";

export const AppComponents = {
  Components,
};

initDomAppTheme();

@customElement("trmrk-app")
export class AppElement extends LitElement {
  static styles = [...globalStyles];

  docBodyHeight: number;

  constructor() {
    super();
    this.docBodyHeight = window.innerHeight;
  }

  render() {
    return html`
      <trmrk-app-layout appTitle="Turmerik Notes">
        <main slot="body">
          <p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p style="display: block; position: absolute; bottom: 0px;">
            qwrqwer
          </p>
        </main>
      </trmrk-app-layout>
    `;
  }
}
