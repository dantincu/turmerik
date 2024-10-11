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
  BsIconBtnElementMixinType,
} from "./BsIconBtnElement";

import {
  LongPressController,
  LongPressControllerEventData,
  LongPressControllerEventDataTuple,
} from "../../controlers/LongPressController";

export class LongPressableBsIconBtnElement extends BsIconBtnElementMixin<
  Constructor<LitElement> & IBsIconBtnElementMixin
>(BsIconBtnElementMixinType) {
  static styles = [...BsIconBtnElement.styles];

  @property()
  public treatRightClickAsLongPress?: "true" | "false" | "";

  @property()
  public longPressIntervalMillis?: string;

  @property()
  public touchOrMouseMoveMinPx?: string;

  private __hostHtmlElement: HTMLElement | null;
  private __mainHtmlElement: HTMLButtonElement | null;

  private longPressController: LongPressController;

  private get mainHtmlElement() {
    this.__mainHtmlElement ??= this.renderRoot.children[0] as HTMLButtonElement;
    return this.__mainHtmlElement;
  }

  constructor(...args: any[]) {
    super();
    this.__hostHtmlElement = null;
    this.__mainHtmlElement = null;

    this.longPressController = new LongPressController(this, {
      hostHtmlElementFactory: () => this,
      mainHtmlElementFactory: () => this.mainHtmlElement,
      treatRightClickAsLongPress: this.treatRightClickAsLongPress === "true",
      longPressIntervalMillis: parseInt(this.longPressIntervalMillis ?? ""),
      touchOrMouseMoveMinPx: parseInt(this.touchOrMouseMoveMinPx ?? ""),
    });
  }

  protected getButtonCssClassesArr() {
    // @ts-ignore
    const buttonCssClassesArr = super.getButtonCssClassesArr();
    buttonCssClassesArr.push("trmrk-btn-long-press-enabled");
    return buttonCssClassesArr;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.longPressController.longPressEventListeners.subscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.subscribe(
      this.onShortPress
    );
  }

  disconnectedCallback(): void {
    super.connectedCallback();

    this.longPressController.longPressEventListeners.unsubscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.unsubscribe(
      this.onShortPress
    );
  }

  updated() {
    this.longPressController.registerEventListeners();
  }

  onLongPress(evt: LongPressControllerEventData) {
    console.log("onLongPress");
  }
  onShortPress(evt: LongPressControllerEventDataTuple) {
    console.log("onShortPress");
  }
}

customElements.define(
  "trmrk-long-pressable-bs-icon-btn",
  LongPressableBsIconBtnElement
);
