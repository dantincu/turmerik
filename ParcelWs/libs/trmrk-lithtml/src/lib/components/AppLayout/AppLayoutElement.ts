import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators";

import {
  updateHtmlDocTitle,
  getAppThemeCssClassName,
  getAppModeCssClassName,
} from "../../../trmrk-browser/domUtils/core";

import { globalStyles } from "../../domUtils/css";

import {
  showAppHeaderPropFactory,
  showAppTabsBarPropFactory,
} from "../../dataStore/appHeader";

import { showAppFooterPropFactory } from "../../dataStore/appFooter";

import { enableExplorerPanelPropFactory } from "../../dataStore/appBody";

import {
  appLayoutRootDomElemPropFactory,
  appLayoutCssClassPropFactory,
  docTitlePropFactory,
  defaultDocTitlePropFactory,
  appTitlePropFactory,
  defaultAppTitlePropFactory,
} from "../../dataStore/appLayout";

import { AppLayoutStyles } from "./styles";

import {
  isCompactModePropFactory,
  isDarkModePropFactory,
} from "../../dataStore/common";

@customElement("trmrk-app-layout")
export class AppLayoutElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-app-layout .trmrk-popovers-container {
        display: block;
        width: 0px;
        height: 0px;
        overflow: hidden;
      }
    `,
  ];

  constructor() {
    super();
    this.docTitleHasChanged = false;
    this.appTitleHasChanged = false;
    this.docTitleUpdated = this.docTitleUpdated.bind(this);
    this.appTitleUpdated = this.appTitleUpdated.bind(this);
  }

  protected readonly isCompactModeProp =
    isCompactModePropFactory.createController(this);

  protected readonly isDarkModeProp =
    isDarkModePropFactory.createController(this);

  protected readonly appLayoutCssClassProp =
    appLayoutCssClassPropFactory.createController(this);

  protected readonly docTitleProp = docTitlePropFactory.createController(this);

  protected readonly defaultDocTitleProp =
    defaultDocTitlePropFactory.createController(this);

  protected readonly appTitleProp = appTitlePropFactory.createController(this);

  protected readonly defaultAppTitleProp =
    defaultAppTitlePropFactory.createController(this);

  protected readonly showAppTabsBarProp =
    showAppTabsBarPropFactory.createController(this);

  protected readonly showAppHeaderProp =
    showAppHeaderPropFactory.createController(this);

  protected readonly showAppFooterProp =
    showAppFooterPropFactory.createController(this);

  protected readonly enableExplorerPanelProp =
    enableExplorerPanelPropFactory.createController(this);

  docTitleHasChanged: boolean;
  appTitleHasChanged: boolean;

  render() {
    return [
      html`<div
        class="trmrk-app-layout ${getAppThemeCssClassName(
          this.isDarkModeProp.value
        )} ${getAppModeCssClassName(this.isCompactModeProp.value)} ${this
          .appLayoutCssClassProp.value}"
      >
        ${this.showAppHeaderProp.value
          ? html`<trmrk-app-header
              ><slot
                name="header-first-content"
                slot="header-first-content"
              ></slot
              ><slot name="header-content" slot="header-content"></slot
            ></trmrk-app-header>`
          : null}
        <div
          class="trmrk-app-body ${this.showAppHeaderProp.value
            ? "trmrk-after-header"
            : ""} ${this.showAppFooterProp.value ? "trmrk-before-footer" : ""}"
        >
          ${this.enableExplorerPanelProp
            ? html`<slot name="explorer-content"></slot>`
            : null}
          <slot name="body-content"></slot>
        </div>
        ${this.showAppFooterProp.value
          ? html`<trmrk-app-footer>
                <slot name="footer-content" slot="footer-content"></slot
              ></slot>
              </trmrk-app-footer>`
          : null}
      </div>`,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.docTitleProp.observable.subscribe(this.docTitleUpdated);
    this.appTitleProp.observable.subscribe(this.appTitleUpdated);
    this.setAppLayoutDomElems();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.docTitleProp.observable.unsubscribe(this.docTitleUpdated);
    this.appTitleProp.observable.unsubscribe(this.appTitleUpdated);

    appLayoutRootDomElemPropFactory.value = null;
  }

  updated(changedProperties: PropertyValues) {
    if (this.docTitleHasChanged || this.appTitleHasChanged) {
      this.updateHtmlDocTitleCore();
      this.docTitleHasChanged = false;
      this.appTitleHasChanged = false;
    }

    this.setAppLayoutDomElems();
  }

  firstUpdated(changedProperties: PropertyValues) {
    this.updateHtmlDocTitleCore();
    this.setAppLayoutDomElems();
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

  setAppLayoutDomElems() {
    const rootElem = this.renderRoot;
    appLayoutRootDomElemPropFactory.value =
      rootElem.querySelector(".trmrk-app-layout");
  }
}
