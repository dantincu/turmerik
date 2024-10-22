import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { AppLayoutStyles } from "../AppLayout/core";
import { globalStyles } from "../../domUtils/css";
import { customEvent } from "../../../trmrk-browser/domUtils/core";

@customElement("trmrk-grid-item")
export class GridItemElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-grid-item {
        display: grid;
        grid-template-columns: 43px auto 43px;
        width: 100%;
        align-items: center; /* Ensure items are centered vertically */
        white-space: nowrap;
      }

      .trmrk-grid-item > .trmrk-label {
        cursor: pointer;
        overflow: hidden; /* Hide overflowed text */
        text-overflow: ellipsis; /* Show ellipsis for overflowed text */
      }

      .trmrk-grid-item > .trmrk-icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ];

  @property()
  public cssClass?: string;

  @property()
  public iconCssClass?: string;

  @property()
  public iconBtnHasNoBorder?: boolean;

  @property()
  public itemLabel!: string;

  render() {
    return html`<div class="trmrk-grid-item ${this.cssClass}">
      <trmrk-bs-icon-btn
        @click=${this.iconClick}
        class="trmrk-icon col-start-1 col-end-2"
        ?btnHasNoBorder=${this.iconBtnHasNoBorder ?? true}
        iconCssClass="${this.iconCssClass}"
      ></trmrk-bs-icon-btn>
      <span @click=${this.labelClick} class="trmrk-label col-start-2 col-end-3"
        >${this.itemLabel}</span
      >
      <trmrk-bs-icon-btn
        @click=${this.iconClick}
        class="trmrk-icon col-start-3 -col-end-1"
        ?btnHasNoBorder=${this.iconBtnHasNoBorder ?? true}
        iconCssClass="${this.iconCssClass}"
      ></trmrk-bs-icon-btn>
    </div>`;
  }

  iconClick(e: MouseEvent) {
    this.dispatchEvent(customEvent("iconclick", e));
  }

  labelClick(e: MouseEvent) {
    this.dispatchEvent(customEvent("labelclick", e));
  }
}
