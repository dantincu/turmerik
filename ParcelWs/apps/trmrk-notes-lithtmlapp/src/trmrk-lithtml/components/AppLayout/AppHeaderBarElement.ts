import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import {
  LongPressEventData,
  LongPressEventDataTuple,
} from "../../controlers/LongPressController";

@customElement("trmrk-app-header-bar")
export class AppHeaderBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-app-header {
        display: flex;
        position: fixed;
        width: 100%;
        height: 48px;
        padding: 3px;
        cursor: pointer;
      }
    `,
  ];

  @property()
  cssClass?: string;

  onTouchStart(evt: CustomEvent<LongPressEventDataTuple>) {
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
    /* console.log(evtName, evt);
    const elem = document.createElement("p");
    elem.innerText = `${evtName}: ${JSON.stringify(evt, null, "  ")}`;
    document.querySelector("trmrk-app")!.after(elem); */
  }

  render() {
    return html`<header class="trmrk-app-header ${this.cssClass}">
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
    </header>`;
  }
}
