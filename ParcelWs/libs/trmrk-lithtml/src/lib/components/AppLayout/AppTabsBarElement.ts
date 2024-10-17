import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  showAppHeaderHistoryNavButtonsPropFactory,
  enableExplorerPanelPropFactory,
} from "./core";

@customElement("trmrk-app-tabs-bar")
export class AppTabsBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-tabs-list {
        display: flex;
      }
    `,
  ];

  render() {
    return html`<div class="trmrk-app-tabs-bar"></div>`;
  }
}
