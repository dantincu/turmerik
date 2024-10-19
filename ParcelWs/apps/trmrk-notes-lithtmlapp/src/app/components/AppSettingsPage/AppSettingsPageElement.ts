import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppPage, updateAppPageProps } from "../../utilities/data";

import { AppLayoutStyles } from "../../../trmrk-lithtml/components/AppLayout/core";

@customElement("trmrk-app-settings-page")
export class AppSettingsPageElement extends LitElement {
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
    return html``;
  }
}
