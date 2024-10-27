import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../../domUtils/css";

import { AppPage, updateAppPageProps } from "../../../dataStore/core";

import {
  setAppMode,
  setAppTheme,
} from "../../../../trmrk-lithtml/domUtils/core";

import {
  isCompactModePropFactory,
  isDarkModePropFactory,
} from "../../../../trmrk-lithtml/dataStore/common";

import { AppLayoutStyles } from "../../../../trmrk-lithtml/components/AppLayout/styles";

@customElement("trmrk-app-settings-page")
export class AppSettingsPageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  protected readonly isCompactMode =
    isCompactModePropFactory.createController(this);

  protected readonly isDarkMode = isDarkModePropFactory.createController(this);

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    updateAppPageProps(AppPage.Settings);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<trmrk-app-panel cssClass="trmrk-app-settings-page-content"
      ><div class="trmrk-panel-content" slot="panel-content">
        <div class="trmrk-form">
          <div class="trmrk-form-group">
            <label class="trmrk-form-label" @click=${this.toggleAppThemeClicked}
              >${this.isDarkMode.value ? "Dark Mode" : "Light Mode"}</label
            >
            <trmrk-bs-icon-btn
              @click=${this.toggleAppThemeClicked}
              btnHasNoBorder
              iconCssClass="${this.isDarkMode.value
                ? "bi-moon-fill"
                : "bi-sun-fill"}"
            ></trmrk-bs-icon-btn>
          </div>
          <div class="trmrk-form-group">
            <label class="trmrk-form-label" @click=${this.toggleAppModeClicked}
              >${this.isCompactMode.value ? "Compact Mode" : "Full Mode"}</label
            >${this.isCompactMode.value
              ? html`<trmrk-bs-icon-btn
                  @click=${this.toggleAppModeClicked}
                  btnHasNoBorder
                  iconCssClass="bi-file"
                ></trmrk-bs-icon-btn>`
              : html`<trmrk-bs-icon-btn
                  @click=${this.toggleAppModeClicked}
                  btnHasNoBorder
                  iconCssClass="bi-layout-text-sidebar-reverse"
                ></trmrk-bs-icon-btn>`}
          </div>
        </div>
      </div></trmrk-app-panel
    >`;
  }

  toggleAppThemeClicked(e: MouseEvent) {
    const newValue = !this.isDarkMode.value;
    setAppTheme(newValue);
    this.isDarkMode.value = newValue;
  }

  toggleAppModeClicked(e: MouseEvent) {
    const newValue = !this.isCompactMode.value;
    setAppMode(newValue);
    this.isCompactMode.value = newValue;
  }
}

@customElement("trmrk-app-settings-footer-page")
export class AppSettingsPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
