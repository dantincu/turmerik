import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import {
  isDarkModePropFactory,
  isCompactModePropFactory,
} from "../../domUtils/core";

import { globalStyles } from "../../domUtils/css";

import {
  enableAppHeaderPropFactory,
  showAppHeaderPropFactory,
  enableAppFooterPropFactory,
  showAppFooterPropFactory,
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
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }

      .trmrk-panel-body {
        position: absolute;
        inset: 0;
        margin: 0px;
        padding: 0px;
      }
    `,
  ];

  @property()
  public cssClass?: string;

  protected readonly isDarkModeProp =
    isDarkModePropFactory.createController(this);

  protected readonly isCompactModeProp =
    isCompactModePropFactory.createController(this);

  protected readonly showAppHeaderProp =
    showAppHeaderPropFactory.createController(this);

  protected readonly enableAppHeaderProp =
    enableAppHeaderPropFactory.createController(this);

  protected readonly showAppFooterProp =
    showAppFooterPropFactory.createController(this);

  protected readonly enableAppFooterProp =
    enableAppFooterPropFactory.createController(this);

  protected get enableAppHeader() {
    return this.enableAppHeaderProp.observable.value;
  }

  protected get showAppHeader() {
    return this.showAppHeaderProp.observable.value;
  }

  protected get enableAppFooter() {
    return this.enableAppFooterProp.observable.value;
  }

  protected get showAppFooter() {
    return this.showAppFooterProp.observable.value;
  }

  render() {
    return [
      html`<div class="trmrk-app-layout ${this.cssClass}">
        ${this.enableAppHeader && this.showAppHeader
          ? html`<trmrk-app-header-bar
              ><slot name="header"></slot
            ></trmrk-app-header-bar>`
          : html``}
        <div class="trmrk-panel-body"><slot name="body"></slot></div>
        ${this.enableAppFooter && this.showAppFooter
          ? html`<trmrk-app-footer-bar
              ><slot name="footer"></slot
            ></trmrk-app-footer-bar>`
          : html``}
      </div>`,
    ];
  }
}
