import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  showAppTabsBarPropFactory,
  showAppHeaderHistoryNavButtonsPropFactory,
  appHeaderGoToParentButtonPropFactory,
  enableAppHeaderHistoryNavButtonsDefaultBehaviorPropFactory,
  showAppHeaderOptiosButtonPropFactory,
  appHeaderHistoryBackButtonEnabledPropFactory,
  appHeaderHistoryForwardButtonEnabledPropFactory,
  appHeaderCustomContentStartingColumnsCountPropFactory,
  appHeaderOptiosButtonDomElemPropFactory,
} from "../../dataStore/appHeader";

import { enableExplorerPanelPropFactory } from "../../dataStore/appBody";

import {
  appTitlePropFactory,
  defaultAppTitlePropFactory,
} from "../../dataStore/appLayout";

import { appLayoutOptionsPopoverDomElemTagNamePropFactory } from "../../dataStore/appOptionsPopoversContainer";

import {
  showAppOptionsPopoverPropFactory,
  optionsPopoverManagerPropFactory,
} from "../../dataStore/common";

import { AppLayoutStyles } from "./styles";

import { RootElemAvaillableEventData } from "../../domUtils/core";

import { BsPopoverManager } from "../../services/BsPopoverManager";

@customElement("trmrk-app-header")
export class AppHeaderElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    ...AppLayoutStyles.value,
    css`
      .trmrk-app-header {
        display: grid;
        grid-template-columns: 43px 43px 43px auto 44px;
      }

      .trmrk-header-content {
        display: flex;
      }

      .trmrk-options-popover-root {
        /* display: block;
        width: 0px;
        height: opx;
        overflow: hidden; */
      }

      .trmrk-options-popover-root.trmrk-show {
        /* width: 100vw;
        height: 100vh;
        overflow-y: scroll;
        z-index: 100; */
      }
    `,
  ];

  protected readonly appTitleProp = appTitlePropFactory.createController(this);

  protected readonly defaultAppTitleProp =
    defaultAppTitlePropFactory.createController(this);

  protected readonly appHeaderCustomContentStartingColumnsCountProp =
    appHeaderCustomContentStartingColumnsCountPropFactory.createController(
      this
    );

  protected readonly showAppTabsBarProp =
    showAppTabsBarPropFactory.createController(this);

  protected readonly appHeaderGoToParentButtonProp =
    appHeaderGoToParentButtonPropFactory.createController(this);

  protected readonly showAppHeaderHistoryNavButtonsProp =
    showAppHeaderHistoryNavButtonsPropFactory.createController(this);

  protected readonly enableAppHeaderHistoryNavButtonsDefaultBehaviorProp =
    enableAppHeaderHistoryNavButtonsDefaultBehaviorPropFactory.createController(
      this
    );

  protected readonly appHeaderHistoryBackButtonEnabledProp =
    appHeaderHistoryBackButtonEnabledPropFactory.createController(this);

  protected readonly appHeaderHistoryForwardButtonEnabledProp =
    appHeaderHistoryForwardButtonEnabledPropFactory.createController(this);

  protected readonly enableExplorerPanelProp =
    enableExplorerPanelPropFactory.createController(this);

  protected readonly showAppHeaderOptiosButtonProp =
    showAppHeaderOptiosButtonPropFactory.createController(this);

  protected readonly bsPopoverManager =
    optionsPopoverManagerPropFactory.createController(this);

  historyNavButtonsClickEventsAdded: boolean;

  historyBackBtnElem: HTMLElement | null;
  historyForwardBtnElem: HTMLElement | null;

  constructor() {
    super();
    this.historyNavButtonsClickEventsAdded = false;
    this.historyBackBtnElem = null;
    this.historyForwardBtnElem = null;

    this.navHistoryBackBtnClicked = this.navHistoryBackBtnClicked.bind(this);

    this.navHistoryForwardBtnClicked =
      this.navHistoryForwardBtnClicked.bind(this);

    this.optionsBtnClicked = this.optionsBtnClicked.bind(this);
  }

  render() {
    const showAppHeaderGoToParentButtonsCountIncVal = this
      .appHeaderGoToParentButtonProp.value.isVisible
      ? 1
      : 0;

    const buttonsCount = [
      showAppHeaderGoToParentButtonsCountIncVal,
      this.showAppHeaderHistoryNavButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    const headerContentCssClassesArr = [
      "trmrk-header-content",
      `col-start-${
        buttonsCount +
        (this.appHeaderCustomContentStartingColumnsCountProp.value + 1)
      }`,
      this.showAppHeaderOptiosButtonProp.value ? "col-end-5" : "-col-end-1",
    ];

    const headerContentCssClass = headerContentCssClassesArr.join(" ");

    return html`<header class="trmrk-app-header">
      <slot name="header-first-content"></slot>
      ${this.appHeaderGoToParentButtonProp.value.isVisible
        ? html`<trmrk-bs-icon-btn
            btnHasNoBorder
            ?btnDisabled="${!this.appHeaderGoToParentButtonProp.value
              .isEnabled}"
            iconCssClass="bi-arrow-up"
            class="col-start-${this
              .appHeaderCustomContentStartingColumnsCountProp.value + 1}"
          ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppHeaderHistoryNavButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appHeaderHistoryBackButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-left"
              @click=${this.navHistoryBackBtnClicked}
              class="trmrk-histroy-back-btn col-start-${this
                .appHeaderCustomContentStartingColumnsCountProp.value +
              1 +
              showAppHeaderGoToParentButtonsCountIncVal}"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appHeaderHistoryForwardButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-right"
              @click=${this.navHistoryForwardBtnClicked}
              class="trmrk-histroy-forward-btn col-start-${this
                .appHeaderCustomContentStartingColumnsCountProp.value +
              2 +
              showAppHeaderGoToParentButtonsCountIncVal}"
            ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarProp.value
        ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
        : html`<div class="${headerContentCssClass}">
            <slot name="header-content"></slot>
            ${(this.appTitleProp.value ?? this.defaultAppTitleProp.value) !==
            null
              ? html`<h1>
                  ${this.appTitleProp.value ?? this.defaultAppTitleProp.value}
                </h1>`
              : null}
          </div>`}
      ${this.showAppHeaderOptiosButtonProp.value
        ? html`<trmrk-bs-icon-btn
            data-bs-toggle="popover"
            data-bs-content="Top popover"
            btnHasNoBorder
            class="col-start-5 col-end-5 trmrk-options-btn"
            iconCssClass="bi-three-dots-vertical"
            @click=${this.optionsBtnClicked}
            @rootelemavaillable=${this.optionsButtonAvaillable}
            @rootelemunavaillable=${this.optionsButtonUnavaillable}
          ></trmrk-bs-icon-btn>`
        : null}
    </header>`;
  }

  navHistoryBackBtnClicked(e: MouseEvent) {
    window.history.back();
  }

  navHistoryForwardBtnClicked(e: MouseEvent) {
    window.history.forward();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupOptionsPopoverManager();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.bsPopoverManager.value!.reset();
  }

  updated() {
    this.setupOptionsPopoverManager();
  }

  firstUpdated() {
    this.setupOptionsPopoverManager();
  }

  optionsButtonAvaillable(
    e: CustomEvent<RootElemAvaillableEventData<HTMLButtonElement>>
  ) {
    appHeaderOptiosButtonDomElemPropFactory.value = e.detail.rootElem;
  }

  optionsButtonUnavaillable() {
    appHeaderOptiosButtonDomElemPropFactory.value = null;
  }

  optionsBtnClicked(e: MouseEvent) {
    this.bsPopoverManager.value!.triggerButtonClicked(e);
  }

  setupOptionsPopoverManager() {
    this.bsPopoverManager.value!.setup({
      triggerBtnAvaillableControllerFactory:
        appHeaderOptiosButtonDomElemPropFactory,
      showPopoverControllerFactory: showAppOptionsPopoverPropFactory,
      popoverDomElTagNameControllerFactory:
        appLayoutOptionsPopoverDomElemTagNamePropFactory,
      placement: "left",
    });
  }
}
