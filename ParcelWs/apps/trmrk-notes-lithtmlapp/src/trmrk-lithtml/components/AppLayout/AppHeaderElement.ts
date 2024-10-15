import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  LongPressEventData,
  LongPressEventDataTuple,
} from "../../controlers/LongPressController";

import {
  showAppHeaderPropFactory,
  showAppTabsBarPropFactory,
  appTitlePropFactory,
  enableExplorerPanelPropFactory,
  AppLayoutStyles,
} from "./core";

@customElement("trmrk-app-header")
export class AppHeaderElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-app-footer {
        display: grid;
        grid-template-columns: 43px 43px 43px auto 44px;
      }
    `,
  ];

  protected readonly appTitleProp = appTitlePropFactory.createController(this);

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
    return this.showAppTabsBarProp.value
      ? html`<trmrk-app-tabs-bar></trmrk-app-tabs-bar>`
      : html`<header class="trmrk-app-header">
          ${(this.appTitleProp.value ?? null) !== null
            ? html`<h1>${this.appTitleProp.value}</h1>`
            : html`<slot name="header"></slot>`}
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
