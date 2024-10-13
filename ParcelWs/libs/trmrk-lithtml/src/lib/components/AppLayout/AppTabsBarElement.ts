import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./core";

@customElement("trmrk-app-tabs-bar")
export class AppTabsBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-left-part,
      .trmrk-main-part,
      .trmrk-right-part {
        display: inline-flex;
      }

      .trmrk-left-part {
        width: 100px;
      }

      .trmrk-right-part {
        width: 100px;
        justify-content: right;
      }

      .trmrk-main-part {
        width: calc(100% - 200px);
      }
    `,
  ];

  @property()
  public homePageUrl!: string;

  render() {
    return html`<header class="trmrk-app-header trmrk-app-tabs-bar">
      <div class="trmrk-left-part">
        <a href="${this.homePageUrl}"
          ><trmrk-bs-icon-btn
            btnHasNoBorder
            iconCssClass="bi-house-door-fill"
          ></trmrk-bs-icon-btn
        ></a>
      </div>
      <div class="trmrk-main-part"></div>
      <div class="trmrk-right-part">
        <trmrk-bs-icon-btn
          class="trmrk-display-flex"
          btnHasNoBorder
          iconCssClass="bi-three-dots-vertical"
        ></trmrk-bs-icon-btn>
      </div>
    </header>`;
  }
}
