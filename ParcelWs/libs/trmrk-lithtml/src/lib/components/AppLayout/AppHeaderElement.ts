import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators";

import * as bootstrap from "bootstrap";

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
} from "../../dataStore/appHeader";

import { enableExplorerPanelPropFactory } from "../../dataStore/appBody";

import {
  appLayoutRootDomElemPropFactory,
  appTitlePropFactory,
  defaultAppTitlePropFactory,
} from "../../dataStore/appLayout";

import { appLayoutOptionsPopoverDomElemTagNamePropFactory } from "../../dataStore/appOptionsPopoversContainer";

import { AppLayoutStyles } from "./styles";

import { RootElemAvaillableEventData } from "../../domUtils/core";

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

  protected readonly appLayoutRootDomElemProp =
    appLayoutRootDomElemPropFactory.createController(this);

  protected readonly appLayoutOptionsPopoverDomElemTagNameProp =
    appLayoutOptionsPopoverDomElemTagNamePropFactory.createController(this);

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

  historyNavButtonsClickEventsAdded: boolean;

  historyBackBtnElem: HTMLElement | null;
  historyForwardBtnElem: HTMLElement | null;

  optionsButton: HTMLButtonElement | null;
  optionsPopover: bootstrap.Popover | null;
  optionsPopoverShown: boolean;
  optionsPopoverContentElem: HTMLElement | null;

  constructor() {
    super();
    this.historyNavButtonsClickEventsAdded = false;
    this.historyBackBtnElem = null;
    this.historyForwardBtnElem = null;
    this.optionsButton = null;
    this.optionsPopover = null;
    this.optionsPopoverShown = false;
    this.optionsPopoverContentElem = null;

    this.navHistoryBackBtnClicked = this.navHistoryBackBtnClicked.bind(this);

    this.navHistoryForwardBtnClicked =
      this.navHistoryForwardBtnClicked.bind(this);

    this.optionsBtnClicked = this.optionsBtnClicked.bind(this);
    this.tryCreateOptionsPopover = this.tryCreateOptionsPopover.bind(this);

    this.documentClickedWhenPopoverShown =
      this.documentClickedWhenPopoverShown.bind(this);

    this.removeDocumentClickedWhenPopoverShown =
      this.removeDocumentClickedWhenPopoverShown.bind(this);
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

  updated() {
    this.tryCreateOptionsPopover();
  }

  optionsButtonAvaillable(
    e: CustomEvent<RootElemAvaillableEventData<HTMLButtonElement>>
  ) {
    this.optionsButton = e.detail.rootElem;
    this.tryCreateOptionsPopover();
  }

  optionsButtonUnavaillable() {
    this.optionsButton = null;
    this.optionsPopoverShown = false;
    this.optionsPopoverContentElem = null;

    if (this.optionsPopover) {
      this.optionsPopover.dispose();
      this.optionsPopover = null;
    }
  }

  optionsBtnClicked(e: MouseEvent) {
    if (this.optionsPopover && !this.optionsPopoverShown) {
      this.optionsPopoverShown = true;
      this.optionsPopover.show();

      document.addEventListener("click", this.documentClickedWhenPopoverShown, {
        capture: true,
      });
    }
  }

  tryCreateOptionsPopover() {
    const popoverElemTagName =
      this.appLayoutOptionsPopoverDomElemTagNameProp.value;

    if (
      popoverElemTagName &&
      this.optionsButton &&
      this.appLayoutRootDomElemProp.value
    ) {
      this.optionsPopover = new bootstrap.Popover(this.optionsButton, {
        html: true,
        content: (this.optionsPopoverContentElem =
          document.createElement(popoverElemTagName)),
        trigger: "manual",
        placement: "left",
      });
    }
  }

  documentClickedWhenPopoverShown(e: MouseEvent) {
    const currentTarget = e.target as Node;

    if (this.optionsPopover && this.optionsPopoverShown) {
      if (currentTarget && this.optionsPopoverContentElem) {
        if (!this.optionsPopoverContentElem.contains(currentTarget)) {
          this.optionsPopover.hide();
          this.removeDocumentClickedWhenPopoverShown();
          setTimeout(() => {
            this.optionsPopoverShown = false;
          });
        }
      } else {
        this.removeDocumentClickedWhenPopoverShown();
      }
    } else {
      this.removeDocumentClickedWhenPopoverShown();
    }
  }

  removeDocumentClickedWhenPopoverShown() {
    document.removeEventListener(
      "click",
      this.documentClickedWhenPopoverShown,
      {
        capture: true,
      }
    );
  }
}
