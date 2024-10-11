import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-app-header-bar")
export class AppHeaderBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-app-header {
        display: flex;
        position: fixed;
        width: 100%;
        height: 48px;
        padding: 3px;
        cursor: pointer;
      }
    `,
  ];

  @property()
  cssClass?: string;

  render() {
    return html`<header class="trmrk-app-header ${this.cssClass}">
      <trmrk-bs-icon-btn
        iconCssClass="bi bi-diagram-3"
        iconWrapperCssClass="trmrk-rotate-270deg"
        btnHasNoBorder="true"
      ></trmrk-bs-icon-btn>
      <trmrk-long-pressable-bs-icon-btn
        iconCssClass="bi-alarm"
      ></trmrk-long-pressable-bs-icon-btn>
      <trmrk-bs-icon-btn iconCssClass="bi-alarm"></trmrk-bs-icon-btn>
      <trmrk-bs-icon-btn
        iconCssClass="bi-alarm"
        btnDisabled="true"
      ></trmrk-bs-icon-btn>
    </header>`;
  }
}
