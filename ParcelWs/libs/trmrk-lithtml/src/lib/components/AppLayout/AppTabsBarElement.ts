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

      .trmrk-tabs-list {
        display: flex;
      }
    `,
  ];

  protected readonly showAppTabsBarHistoryNavButtonsProp =
    showAppTabsBarHistoryNavButtonsPropFactory.createController(this);

  protected readonly enableExplorerPanelPropProp =
    enableExplorerPanelPropFactory.createController(this);

  render() {
    let buttonsCount = [
      this.enableExplorerPanelPropProp.value ? 1 : 0,
      this.showAppTabsBarHistoryNavButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    return html`<header class="trmrk-app-header trmrk-app-tabs-bar">
      ${this.enableExplorerPanelPropProp.value
        ? html`<trmrk-bs-icon-btn
            iconCssClass="bi-diagram-3-fill"
            iconWrapperCssClass="-rotate-90"
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
      <div
        class="trmrk-tabs-list col-start-${buttonsCount + 1} col-end-5"
      ></div>
      <trmrk-bs-icon-btn
        class="trmrk-display-flex col-start-5 col-end-5"
        iconCssClass="bi-three-dots-vertical"
      ></trmrk-bs-icon-btn>
    </header>`;
  }
}
