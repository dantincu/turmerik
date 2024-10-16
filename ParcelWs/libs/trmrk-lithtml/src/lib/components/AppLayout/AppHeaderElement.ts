import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  AppLayoutStyles,
  showAppTabsBarPropFactory,
  appTitlePropFactory,
  enableExplorerPanelPropFactory,
  showAppTabsBarHistoryNavButtonsPropFactory,
  showAppHeaderOptiosButtonPropFactory,
  appTabsBarHistoryBackButtonEnabledPropFactory,
  appTabsBarHistoryForwardButtonEnabledPropFactory,
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

  protected readonly showAppTabsBarHistoryNavButtonsProp =
    showAppTabsBarHistoryNavButtonsPropFactory.createController(this);

  protected readonly appTabsBarHistoryBackButtonEnabledProp =
    appTabsBarHistoryBackButtonEnabledPropFactory.createController(this);

  protected readonly appTabsBarHistoryForwardButtonEnabledProp =
    appTabsBarHistoryForwardButtonEnabledPropFactory.createController(this);

  protected readonly enableExplorerPanelPropProp =
    enableExplorerPanelPropFactory.createController(this);

  protected readonly showAppHeaderOptiosButtonProp =
    showAppHeaderOptiosButtonPropFactory.createController(this);

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

  protected readonly showAppTabsBarProp =
    showAppTabsBarPropFactory.createController(this);

  render() {
    let buttonsCount = [
      this.enableExplorerPanelPropProp.value ? 1 : 0,
      this.showAppTabsBarHistoryNavButtonsProp.value ? 2 : 0,
    ].reduce((a, b) => a + b);

    return html`<header class="trmrk-app-header">
      ${this.enableExplorerPanelPropProp.value
        ? html`<trmrk-bs-icon-btn
            btnHasNoBorder
            iconCssClass="bi-diagram-3-fill"
            iconWrapperCssClass="-rotate-90"
          ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarHistoryNavButtonsProp.value
        ? html` <trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appTabsBarHistoryBackButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-left"
            ></trmrk-bs-icon-btn
            ><trmrk-bs-icon-btn
              btnHasNoBorder
              ?btnDisabled="${!this.appTabsBarHistoryForwardButtonEnabledProp
                .value}"
              iconCssClass="bi-arrow-right"
            ></trmrk-bs-icon-btn>`
        : null}
      ${this.showAppTabsBarHistoryNavButtonsProp.value
        ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
        : html`<div
            class="trmrk-header-content col-start-${buttonsCount + 1} ${this
              .showAppHeaderOptiosButtonProp.value
              ? "col-end-5"
              : "-col-end-1"}"
          >
            ${(this.appTitleProp.value ?? null) !== null
              ? html`<h1>${this.appTitleProp.value}</h1>`
              : null}
            <slot name="header"></slot>
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
}
