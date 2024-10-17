import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  showAppTabsBarPropFactory,
  appTitlePropFactory,
  defaultAppTitlePropFactory,
  enableExplorerPanelPropFactory,
  showAppTabsBarHistoryNavButtonsPropFactory,
  enableAppTabsBarHistoryNavButtonsDefaultBehaviorPropFactory,
  showAppHeaderOptiosButtonPropFactory,
  appTabsBarHistoryBackButtonEnabledPropFactory,
  appTabsBarHistoryForwardButtonEnabledPropFactory,
  appHeaderCustomContentStartingColumnsCountPropFactory,
} from "./core";

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
    `,
  ];

  protected readonly appTitleProp = appTitlePropFactory.createController(this);

  protected readonly defaultAppTitleProp =
    defaultAppTitlePropFactory.createController(this);

  protected readonly appHeaderCustomContentStartingColumnsCountProp =
    appHeaderCustomContentStartingColumnsCountPropFactory.createController(
      this
    );

  protected readonly showAppTabsBarHistoryNavButtonsProp =
    showAppTabsBarHistoryNavButtonsPropFactory.createController(this);

  protected readonly enableAppTabsBarHistoryNavButtonsDefaultBehaviorProp =
    enableAppTabsBarHistoryNavButtonsDefaultBehaviorPropFactory.createController(
      this
    );

  protected readonly appTabsBarHistoryBackButtonEnabledProp =
    appTabsBarHistoryBackButtonEnabledPropFactory.createController(this);

  protected readonly appTabsBarHistoryForwardButtonEnabledProp =
    appTabsBarHistoryForwardButtonEnabledPropFactory.createController(this);

  protected readonly enableExplorerPanelProp =
    enableExplorerPanelPropFactory.createController(this);

  protected readonly showAppHeaderOptiosButtonProp =
    showAppHeaderOptiosButtonPropFactory.createController(this);

  protected readonly showAppTabsBarProp =
    showAppTabsBarPropFactory.createController(this);

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
  }

  /* onTouchStart(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onTouchStart", evt.detail);
  }

  onTouchMove(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onTouchMove", evt.detail);
  }

  onTouchEnd(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onTouchEnd", evt.detail);
  }

  onMouseDown(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onMouseDown", evt.detail);
  }

  onMouseMove(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onMouseMove", evt.detail);
  }

  onMouseUp(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onMouseUp", evt.detail);
  }

  onLongPress(evt: CustomEvent<LongPressEventData>) {
    this.addMsg("onLongPress", evt.detail);
  }

  onShortPress(evt: CustomEvent<LongPressEventDataTuple>) {
    this.addMsg("onShortPress", evt.detail);
  }

  addMsg(evtName: string, evt: any) {
    console.log(evtName, evt);
    const elem = document.createElement("p");
    elem.innerText = `${evtName}: ${JSON.stringify(evt, null, "  ")}`;
    document.querySelector("trmrk-app")!.after(elem);
  } */

  render() {
    const enableExplorerPanelButtonsCountIncVal = this.enableExplorerPanelProp
      .value
      ? 1
      : 0;

    const buttonsCount = [
      enableExplorerPanelButtonsCountIncVal,
      this.showAppTabsBarHistoryNavButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    const headerContentCssClassesArr = [
      "trmrk-header-content",
      `col-start-${
        buttonsCount +
        (this.appHeaderCustomContentStartingColumnsCountProp.value + 1)
      }`,
      this.showAppHeaderOptiosButtonProp.value ? "col-end-5" : "-col-end-1",
    ];

    console.log(
      "buttonsCount",
      buttonsCount,
      this.appHeaderCustomContentStartingColumnsCountProp.value,
      headerContentCssClassesArr
    );

    const headerContentCssClass = headerContentCssClassesArr.join(" ");

    let appTabsBarHistoryBackButtonClickHandler:
      | ((e: MouseEvent) => void)
      | null = null;
    let appTabsBarHistoryForwardButtonClickHandler:
      | ((e: MouseEvent) => void)
      | null = null;

    if (
      this.showAppTabsBarHistoryNavButtonsProp.value &&
      this.enableAppTabsBarHistoryNavButtonsDefaultBehaviorProp.value
    ) {
    }

    return html`<header class="trmrk-app-header">
      ${this.enableExplorerPanelProp.value
        ? html`<trmrk-bs-icon-btn
            btnHasNoBorder
            iconCssClass="bi-diagram-3-fill"
            iconWrapperCssClass="-rotate-90"
            class="col-start-${this
              .appHeaderCustomContentStartingColumnsCountProp.value + 1}"
          ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarHistoryNavButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appTabsBarHistoryBackButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-left"
              class="trmrk-histroy-back-btn col-start-${this
                .appHeaderCustomContentStartingColumnsCountProp.value +
              1 +
              enableExplorerPanelButtonsCountIncVal}"
              @click="${appTabsBarHistoryBackButtonClickHandler}"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appTabsBarHistoryForwardButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-right"
              class="trmrk-histroy-forward-btn col-start-${this
                .appHeaderCustomContentStartingColumnsCountProp.value +
              2 +
              enableExplorerPanelButtonsCountIncVal}"
              @click="${appTabsBarHistoryForwardButtonClickHandler}"
            ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarHistoryNavButtonsProp.value
        ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
        : html`<div class="${headerContentCssClass}">
            <slot name="header"></slot>
            ${(this.appTitleProp.value ?? this.defaultAppTitleProp.value) !==
            null
              ? html`<h1>
                  ${this.appTitleProp.value ?? this.defaultAppTitleProp.value}
                </h1>`
              : null}
          </div>`}
      ${this.showAppHeaderOptiosButtonProp.value
        ? html`<trmrk-bs-icon-btn
            btnHasNoBorder
            class="trmrk-display-flex col-start-5 col-end-5"
            iconCssClass="bi-three-dots-vertical"
          ></trmrk-bs-icon-btn>`
        : null}
    </header>`;

    /* return html`<header class="trmrk-app-header">
      <trmrk-bs-icon-btn
        iconCssClass="bi bi-diagram-3"
        iconWrapperCssClass="trmrk-rotate-270deg"
        btnHasNoBorder="true"
      ></trmrk-bs-icon-btn>
      <trmrk-long-pressable-bs-icon-btn
        iconCssClass="bi-alarm"
        @ontouchstart="${this.onTouchStart}"
        @ontouchend="${this.onTouchMove}"
        @ontouchmove="${this.onTouchEnd}"
        @onmousedown="${this.onMouseDown}"
        @onmousemove="${this.onMouseMove}"
        @onmouseup="${this.onMouseUp}"
        @onlongpress="${this.onLongPress}"
        @onshortpress="${this.onShortPress}"
      ></trmrk-long-pressable-bs-icon-btn>
      <trmrk-bs-icon-btn iconCssClass="bi-alarm"></trmrk-bs-icon-btn>
      <trmrk-bs-icon-btn
        iconCssClass="bi-alarm"
        btnDisabled="true"
      ></trmrk-bs-icon-btn>
    </header>` */
  }

  updated() {
    this.addNavButtonsClickEventListenersIfReq();
  }

  firstUpdated() {
    this.addNavButtonsClickEventListenersIfReq();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeNavButtonsClickEventListenersIfReq();
  }

  addNavButtonsClickEventListenersIfReq() {
    if (
      this.enableAppTabsBarHistoryNavButtonsDefaultBehaviorProp.value &&
      !this.historyNavButtonsClickEventsAdded
    ) {
      this.historyBackBtnElem = this.renderRoot.querySelector(
        ".trmrk-histroy-back-btn"
      )!;

      this.historyForwardBtnElem = this.renderRoot.querySelector(
        ".trmrk-histroy-forward-btn"
      )!;

      this.historyBackBtnElem.addEventListener(
        "click",
        this.navHistoryBackBtnClicked
      );

      this.historyForwardBtnElem.addEventListener(
        "click",
        this.navHistoryForwardBtnClicked
      );

      this.historyNavButtonsClickEventsAdded = true;
    }
  }

  removeNavButtonsClickEventListenersIfReq() {
    if (
      this.enableAppTabsBarHistoryNavButtonsDefaultBehaviorProp.value &&
      !this.historyNavButtonsClickEventsAdded
    ) {
      this.historyBackBtnElem?.removeEventListener(
        "click",
        this.navHistoryBackBtnClicked
      );

      this.historyForwardBtnElem?.removeEventListener(
        "click",
        this.navHistoryForwardBtnClicked
      );

      this.historyNavButtonsClickEventsAdded = true;
    }
  }

  navHistoryBackBtnClicked(e: MouseEvent) {
    window.history.back();
  }

  navHistoryForwardBtnClicked(e: MouseEvent) {
    window.history.forward();
  }
}
