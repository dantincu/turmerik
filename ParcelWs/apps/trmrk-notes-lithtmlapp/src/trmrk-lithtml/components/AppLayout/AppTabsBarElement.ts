import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  showAppTabsBarHistoryNavButtonsPropFactory,
  enableExplorerPanelPropFactory,
} from "./core";

@customElement("trmrk-app-tabs-bar")
export class AppTabsBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-app-header {
        display: grid;
        grid-template-columns: 43px 43px 43px auto 44px;
      }
    `,
  ];

  protected readonly showAppTabsBarHistoryNavButtonsProp =
    showAppTabsBarHistoryNavButtonsPropFactory.createController(this);

  protected readonly enableExplorerPanelPropProp =
    enableExplorerPanelPropFactory.createController(this);

  render() {
    return html`<header class="trmrk-app-header trmrk-app-tabs-bar">
      ${this.enableExplorerPanelPropProp.value
        ? html`<trmrk-bs-icon-btn
            iconCssClass="bi-diagram-3-fill"
            iconWrapperCssClass="trmrk-rotate-270deg"
          ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarHistoryNavButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              iconCssClass="bi-arrow-left"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              iconCssClass="bi-arrow-right"
            ></trmrk-bs-icon-btn>`
        : null}
      <div class="trmrk-tabs-list"></div>
      <trmrk-bs-icon-btn
        class="trmrk-display-flex trmrk-grid-column-5"
        iconCssClass="bi-three-dots-vertical"
      ></trmrk-bs-icon-btn>
    </header>`;
  }
}
