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
        grid-template-columns: 43px auto 10px;
        width: 100%;
        align-items: center; /* Ensure items are centered vertically */
        white-space: nowrap;
        border-bottom: 1px solid #888;
      }

      .trmrk-grid-item > .trmrk-main-part {
        display: grid;
        grid-template-rows: 20px 20px;
        cursor: pointer;
      }

      .trmrk-grid-item > .trmrk-main-part > .trmrk-label,
      .trmrk-grid-item > .trmrk-label {
        overflow: hidden; /* Hide overflowed text */
        text-overflow: ellipsis; /* Show ellipsis for overflowed text */
      }

      .trmrk-grid-item > .trmrk-main-part > .trmrk-details-label {
        font-size: 12px;
        color: #888;
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

  @property()
  public itemDetails!: string;

  render() {
    return html`<div class="trmrk-grid-item ${this.cssClass}">
      <trmrk-bs-icon-btn
        @click=${this.iconClick}
        class="trmrk-icon m-0 col-start-1 col-end-2"
        ?btnHasNoBorder=${this.iconBtnHasNoBorder ?? true}
        iconCssClass="${this.iconCssClass}"
      ></trmrk-bs-icon-btn>
      ${(this.itemDetails ?? "") !== ""
        ? html`<div
            class="trmrk-main-part col-start-2 col-end-3"
            @click=${this.labelClick}
          >
            <span class="trmrk-label row-start-1 row-end-2"
              >${this.itemLabel}</span
            >
            <span class="trmrk-details-label row-start-2 -row-end-1"
              >${this.itemDetails}</span
            >
          </div>`
        : html`<span
            class="trmrk-label row-start-1 -row-end-1 col-start-2 col-end-3"
            >${this.itemLabel}</span
          >`}
      <span></span>
    </div>`;
  }

  iconClick(e: MouseEvent) {
    this.dispatchEvent(customEvent("iconclick", e));
  }

  labelClick(e: MouseEvent) {
    this.dispatchEvent(customEvent("labelclick", e));
  }
}
