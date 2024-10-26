import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./styles";

import {
  updateHtmlDocTitle,
  getAppThemeCssClassName,
  getAppModeCssClassName,
} from "../../../trmrk-browser/domUtils/core";

import {
  isCompactModePropFactory,
  isDarkModePropFactory,
} from "../../domUtils/core";

@customElement("trmrk-app-panel")
export class AppPanelElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-app-panel {
      }
    `,
  ];

  protected readonly isCompactModeProp =
    isCompactModePropFactory.createController(this);

  protected readonly isDarkModeProp =
    isDarkModePropFactory.createController(this);

  @property()
  public cssClass?: string;

  render() {
    return html`<div
      class="trmrk-app-panel ${getAppThemeCssClassName(
        this.isDarkModeProp.value
      )} ${getAppModeCssClassName(
        this.isCompactModeProp.value
      )} trmrk-scrollable trmrk-scrollableX trmrk-scrollableY ${this.cssClass}"
    >
      <slot name="panel-content"></slot>
    </div>`;
  }
}
