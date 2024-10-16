import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  showAppHeaderPropFactory,
  appTitlePropFactory,
} from "../../../trmrk-lithtml/components/AppLayout/core";

@customElement("trmrk-app-home-page")
export class AppHomePageElement extends LitElement {
  static styles = [...globalStyles];

  docBodyHeight: number;

  constructor() {
    super();
    this.docBodyHeight = window.innerHeight;
  }

  connectedCallback() {
    super.connectedCallback();

    showAppHeaderPropFactory.observable.value = true;
    appTitlePropFactory.observable.value = "Turmerik Notes";
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <trmrk-app-layout>
        <div slot="header"></div>
        <main slot="body">
          <!--p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p>document body height: ${this.docBodyHeight}</p>
          <p style="display: block; position: absolute; bottom: 0px;">
            qwrqwer
          </p-->
        </main>
        <div slot="footer"></div>
      </trmrk-app-layout>
    `;
  }
}
