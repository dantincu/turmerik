import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators";

import trmrk from "../../../trmrk";
import { Constructor } from "../../../trmrk/core";
import { propOf } from "../../../trmrk/obj";

import { isDarkModePropFactory } from "../../domUtils/core";

import { globalStyles } from "../../domUtils/css";

import { updateDisableAttr } from "../../../trmrk-browser/domUtils/core";

import {
  BsIconBtnElementMixin,
  BsIconBtnElement,
  IBsIconBtnElementMixin,
} from "./BsIconBtnElement";

import {
  LongPressController,
  LongPressControllerEventData,
  LongPressControllerEventDataTuple,
} from "../../controlers/LongPressController";

export class LongPressableBsIconBtnElement extends BsIconBtnElementMixin(
  LitElement
) {
  static styles = [...BsIconBtnElement.styles];

  @property()
  public treatRightClickAsLongPress?: "true" | "false" | "";

  @property()
  public longPressIntervalMillis?: string;

  @property()
  public touchOrMouseMoveMinPx?: string;

  private __longPressController: LongPressController | null;

  constructor(...args: any[]) {
    super();
    this.__longPressController = null;
  }

  protected get longPressController() {
    const longPressController = (this.__longPressController ??=
      this.createLongPressController());

    return longPressController;
  }

  protected createLongPressController() {
    const rootNode = this.getRootNode() as HTMLElement;

    const longPressController = new LongPressController(this, {
      hostHtmlElement: rootNode,
      mainHtmlElement: rootNode.children[0] as HTMLButtonElement,
      treatRightClickAsLongPress: this.treatRightClickAsLongPress === "true",
      longPressIntervalMillis: parseInt(this.longPressIntervalMillis ?? ""),
      touchOrMouseMoveMinPx: parseInt(this.touchOrMouseMoveMinPx ?? ""),
    });

    return longPressController;
  }

  protected getButtonCssClassesArr() {
    const buttonCssClassesArr = super.getButtonCssClassesArr();
    buttonCssClassesArr.push("trmrk-btn-long-press-enabled");
    return buttonCssClassesArr;
  }

  /* connectedCallback(): void {
    this.longPressController.longPressEventListeners.subscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.subscribe(
      this.onShortPress
    );
  }

  disconnectedCallback(): void {
    this.longPressController.longPressEventListeners.unsubscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.unsubscribe(
      this.onShortPress
    );
  } */

  onLongPress(evt: LongPressControllerEventData) {
    console.log("onLongPress");
  }
  onShortPress(evt: LongPressControllerEventDataTuple) {
    console.log("onShortPress");
  }

  render() {
    console.log("LongPressableBsIconBtnElement");
    return super.render();
    // return html`asdfasdf`;
  }
}

customElements.define(
  "trmrk-long-pressable-bs-icon-btn",
  LongPressableBsIconBtnElement
);
