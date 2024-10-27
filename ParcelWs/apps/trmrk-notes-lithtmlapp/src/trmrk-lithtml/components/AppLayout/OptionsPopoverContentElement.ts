import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./styles";

import { settingsPageUrlPropFactory } from "../../dataStore/common";

import {
  refreshAppPageButtonPropFactory,
  viewOpenTabsButtonPropFactory,
  goToSettingsPageButtonPropFactory,
} from "../../dataStore/appOptionsPopover";

import { optionsPopoverManagerPropFactory } from "../../dataStore/common";

@customElement("trmrk-options-popover-content")
export class OptionsPopoverContentElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      :host {
        display: flex;
      }

      .trmrk-options-popover-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    `,
  ];

  constructor() {
    super();
  }

  protected refreshAppPageButton =
    refreshAppPageButtonPropFactory.createController(this);

  protected viewOpenTabsButton =
    viewOpenTabsButtonPropFactory.createController(this);

  protected goToSettingsPageButton =
    goToSettingsPageButtonPropFactory.createController(this);

  protected settingsPageUrl = settingsPageUrlPropFactory.createController(this);

  render() {
    return html` <div class="trmrk-options-popover-content">
      ${this.refreshAppPageButton.value.isVisible
        ? html`<div class="trmrk-form-group">
            <label
              class="trmrk-form-label"
              @click=${this.refreshAppPageBtnClicked}
              >Refresh Page</label
            >
            <trmrk-bs-icon-btn
              @click=${this.refreshAppPageBtnClicked}
              btnHasNoBorder
              ?btnDisabled=${!this.refreshAppPageButton.value.isEnabled}
              iconCssClass="bi-arrow-clockwise"
            ></trmrk-bs-icon-btn>
          </div>`
        : null}
      ${this.refreshAppPageButton.value.isVisible
        ? html`<div class="trmrk-form-group">
            <label
              class="trmrk-form-label"
              @click=${this.viewCurrentlyOpenTabsBtnClicked}
              >View Currently Open Tabs</label
            >
            <trmrk-bs-icon-btn
              @click=${this.viewCurrentlyOpenTabsBtnClicked}
              btnHasNoBorder
              ?btnDisabled=${!this.refreshAppPageButton.value.isEnabled}
              iconCssClass="bi-segmented-nav"
            ></trmrk-bs-icon-btn>
          </div>`
        : null}
      ${this.refreshAppPageButton.value.isVisible
        ? html`<div class="trmrk-form-group">
            <a class="trmrk-label-link" href="${this.settingsPageUrl.value}"
              @click=${
                this.goToSettingsPageBtnClicked
              }><label class="trmrk-form-label">Settings</label>
            <trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled=${!this.refreshAppPageButton.value.isEnabled}
              iconCssClass="bi-gear"
            ></trmrk-bs-icon-btn>
          </div></a>`
        : null}
    </div>`;
  }

  refreshAppPageBtnClicked(e: MouseEvent) {
    window.location.reload();
  }

  viewCurrentlyOpenTabsBtnClicked(e: MouseEvent) {
    optionsPopoverManagerPropFactory.value!.reset();
  }

  goToSettingsPageBtnClicked(e: MouseEvent) {
    optionsPopoverManagerPropFactory.value!.reset();
  }
}
