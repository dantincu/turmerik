import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import {
  isDarkModePropFactory,
  isCompactModePropFactory,
} from "../../domUtils/core";

import { globalStyles } from "../../domUtils/css";

import {
  showAppHeaderPropFactory,
  showAppTabsBarPropFactory,
  showAppFooterPropFactory,
  showExplorerPanelPropFactory,
  AppLayoutStyles,
} from "./core";

@customElement("trmrk-app-layout")
export class AppLayoutElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

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

  protected readonly showAppHeaderProp =
    showAppHeaderPropFactory.createController(this);

  protected readonly showAppFooterProp =
    showAppFooterPropFactory.createController(this);

  protected readonly showExplorerPanelProp =
    showExplorerPanelPropFactory.createController(this);

  protected get showAppHeader() {
    return this.showAppHeaderProp.observable.value;
  }

  protected get showAppTabsBar() {
    return this.showAppTabsBarProp.observable.value;
  }

  protected get showAppFooter() {
    return this.showAppFooterProp.observable.value;
  }

  protected get showExplorerPanel() {
    return this.showExplorerPanelProp.observable.value;
  }

  render() {
    return [
      html`<div class="trmrk-app-layout ${this.cssClass}">
        ${
          this.showAppHeader
            ? this.showAppTabsBar
              ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
              : html`<header class="trmrk-app-header">
                  ${(this.appTitle ?? false) !== false
                    ? html`<h1>${this.appTitle}</h1>`
                    : html`<slot name="header"></slot>`}
                </header>`
            : null
        }
        <div
          class="trmrk-app-body ${
            this.showAppHeader ? "trmrk-after-header" : ""
          } ${this.showAppFooter ? "trmrk-before-footer" : ""}""
        >
          <slot name="body"></slot>
        </div>
        ${
          this.showAppFooter
            ? html`<footer class="trmrk-app-footer ${this.cssClass}">
                <slot name="footer"></slot>
              </footer>`
            : null
        }
      </div>`,
    ];
  }
}
