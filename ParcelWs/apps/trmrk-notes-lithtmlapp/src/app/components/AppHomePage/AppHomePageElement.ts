import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppPage, updateAppPageProps } from "../../utilities/data";

import { AppLayoutStyles } from "../../../trmrk-lithtml/components/AppLayout/core";

@customElement("trmrk-app-home-page")
export class AppHomePageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  docBodyHeight: number;

  constructor() {
    super();
    this.docBodyHeight = window.innerHeight;
  }

  connectedCallback() {
    super.connectedCallback();
    updateAppPageProps(AppPage.Home);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p>document body height: ${this.docBodyHeight}</p>
      <p style="display: block; position: absolute; bottom: 0px;">qwrqwer</p>
    `;
  }
}

@customElement("trmrk-app-home-page-footer")
export class AppHomePageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  render() {
    return html`<div class="trmrk-app-home-page-footer-content">
      <a class="trmrk-btn-link" href="/app/folder-entries"
        ><trmrk-bs-icon-btn
          btnHasNoBorder
          iconCssClass="bi-folder-fill text-folder"
        ></trmrk-bs-icon-btn
      ></a>
    </div>`;
  }
}
