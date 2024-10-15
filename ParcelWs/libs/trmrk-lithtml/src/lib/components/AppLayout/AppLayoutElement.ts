import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators";

import {
  isDarkModePropFactory,
  isCompactModePropFactory,
} from "../../domUtils/core";

import { propOf } from "../../../trmrk/obj";

import { updateHtmlDocTitle } from "../../../trmrk-browser/domUtils/core";

import { globalStyles } from "../../domUtils/css";

import {
  appLayoutCssClassPropFactory,
  docTitlePropFactory,
  defaultDocTitlePropFactory,
  appTitlePropFactory,
  defaultAppTitlePropFactory,
  showAppHeaderPropFactory,
  showAppTabsBarPropFactory,
  showAppFooterPropFactory,
  enableExplorerPanelPropFactory,
  AppLayoutStyles,
} from "./core";

@customElement("trmrk-app-layout")
export class AppLayoutElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  constructor() {
    super();
    this.docTitleHasChanged = false;
    this.appTitleHasChanged = false;
    this.docTitleUpdated = this.docTitleUpdated.bind(this);
    this.appTitleUpdated = this.appTitleUpdated.bind(this);
  }

  protected readonly appLayoutCssClassProp =
    appLayoutCssClassPropFactory.createController(this);

  protected readonly docTitleProp = docTitlePropFactory.createController(this);

  protected readonly defaultDocTitleProp =
    defaultDocTitlePropFactory.createController(this);

  protected readonly appTitleProp = appTitlePropFactory.createController(this);

  protected readonly defaultAppTitleProp =
    defaultAppTitlePropFactory.createController(this);

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
    enableExplorerPanelPropFactory.createController(this);

  docTitleHasChanged: boolean;
  appTitleHasChanged: boolean;

  render() {
    return [
      html`<div class="trmrk-app-layout ${this.appLayoutCssClassProp.value}">
        ${
          this.showAppHeaderProp.value
            ? html`<trmrk-app-header></trmrk-app-header>`
            : null
        }
        <div
          class="trmrk-app-body ${
            this.showAppHeaderProp.value ? "trmrk-after-header" : ""
          } ${this.showAppFooterProp.value ? "trmrk-before-footer" : ""}""
        >
          <slot name="body"></slot>
        </div>
        ${
          this.showAppFooterProp.value
            ? html`<trmrk-app-footer>
                <slot name="footer"></slot>
              </trmrk-app-footer>`
            : null
        }
      </div>`,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.docTitleProp.observable.subscribe(this.docTitleUpdated);
    this.appTitleProp.observable.subscribe(this.appTitleUpdated);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.docTitleProp.observable.unsubscribe(this.docTitleUpdated);
    this.appTitleProp.observable.unsubscribe(this.appTitleUpdated);
  }

  updated(changedProperties: PropertyValues) {
    if (this.docTitleHasChanged || this.appTitleHasChanged) {
      this.updateHtmlDocTitleCore();
      this.docTitleHasChanged = false;
      this.appTitleHasChanged = false;
    }
  }

  firstUpdated(changedProperties: PropertyValues) {
    this.updateHtmlDocTitleCore();
  }

  updateHtmlDocTitleCore() {
    updateHtmlDocTitle(
      [
        this.docTitleProp.value,
        this.defaultDocTitleProp.value,
        this.appTitleProp.value,
        this.defaultAppTitleProp.value,
      ].find((str) => str) ?? ""
    );
  }

  docTitleUpdated() {
    this.docTitleHasChanged = true;
  }

  appTitleUpdated() {
    this.appTitleHasChanged = true;
  }
}
