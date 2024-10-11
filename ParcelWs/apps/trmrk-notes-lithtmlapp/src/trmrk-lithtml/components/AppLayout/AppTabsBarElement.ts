import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-app-tabs-bar")
export class AppTabsBarElement extends LitElement {
  static styles = [...globalStyles.value];

  render() {
    return html`<header class="trmrk-app-header trmrk-app-tabs-bar"></header>`;
  }
}
