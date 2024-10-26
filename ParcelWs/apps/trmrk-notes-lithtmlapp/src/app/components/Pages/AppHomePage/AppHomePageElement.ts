import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../../domUtils/css";

import { AppPage, updateAppPageProps } from "../../../dataStore/core";

import { AppLayoutStyles } from "../../../../trmrk-lithtml/components/AppLayout/styles";

@customElement("trmrk-app-home-page")
export class AppHomePageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    updateAppPageProps(AppPage.Home);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<trmrk-app-panel cssClass="trmrk-app-home-page-content"
      ><div slot="panel-content"></div
    ></trmrk-app-panel>`;
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
