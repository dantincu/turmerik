import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import {
  isDarkModePropFactory,
  isCompactModePropFactory,
} from "../../domUtils/core";

import { globalStyles } from "../../domUtils/css";

import {
  enableAppHeaderPropFactory,
  showAppTabsBarPropFactory,
  enableAppFooterPropFactory,
  enableExplorerPanelPropFactory,
} from "./core";

@customElement("trmrk-app-layout")
export class AppLayoutElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-app-layout {
        display: block;
        position: relative;
        z-index: 0;
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
      }

      .trmrk-app-header h1 {
        text-align: center;
      }

      .trmrk-app-body {
        position: absolute;
        inset: 0;
        margin: 0px;
        padding: 0px;
      }

      .trmrk-app-body.trmrk-after-header {
        top: 48px;
      }
    `,
  ];

  constructor() {
    super();
  }

  @property()
  public cssClass?: string;

  @property()
  public docTitle?: string;

  @property()
  public appTitle?: string;

  protected readonly isDarkModeProp =
    isDarkModePropFactory.createController(this);

  protected readonly isCompactModeProp =
    isCompactModePropFactory.createController(this);

  protected readonly showAppTabsBarProp =
    showAppTabsBarPropFactory.createController(this);

  protected readonly enableAppHeaderProp =
    enableAppHeaderPropFactory.createController(this);

  protected readonly enableAppFooterProp =
    enableAppFooterPropFactory.createController(this);

  protected readonly enableExplorerPanelProp =
    enableExplorerPanelPropFactory.createController(this);

  protected get enableAppHeader() {
    return this.enableAppHeaderProp.observable.value;
  }

  protected get showAppTabsBar() {
    return this.showAppTabsBarProp.observable.value;
  }

  protected get enableAppFooter() {
    return this.enableAppFooterProp.observable.value;
  }

  protected get enableExplorerPanel() {
    return this.enableExplorerPanelProp.observable.value;
  }

  render() {
    return [
      html`<div class="trmrk-app-layout ${this.cssClass}">
        ${this.enableAppHeader
          ? this.showAppTabsBar
            ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
            : html`<header class="trmrk-app-header">
                ${(this.appTitle ?? false) !== false
                  ? html`<h1>${this.appTitle}</h1>`
                  : html`<slot name="header"></slot>`}
              </header>`
          : null}
        <div
          class="trmrk-app-body ${this.enableAppHeader
            ? "trmrk-after-header"
            : ""}"
        >
          <trmrk-bs-icon-btn
            iconCssClass="bi-alarm"
            btnIsOutlinedAppTheme="${true}"
          ></trmrk-bs-icon-btn
          ><slot name="body"></slot>
        </div>
        ${this.enableAppFooter
          ? html`<trmrk-app-footer
              ><slot name="footer"></slot
            ></trmrk-app-footer>`
          : null}
      </div>`,
    ];
  }
}
