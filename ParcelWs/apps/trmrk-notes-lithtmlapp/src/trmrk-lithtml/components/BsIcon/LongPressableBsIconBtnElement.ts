import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators";

import { Constructor } from "../../../trmrk/core";

import { customEvent } from "../../../trmrk-browser/domUtils/core";

import {
  BsIconBtnElementMixin,
  BsIconBtnElement,
  IBsIconBtnElementMixin,
  BsIconBtnElementMixinType,
} from "./BsIconBtnElement";

import {
  LongPressController,
  LongPressEventData,
  LongPressEventDataTuple,
} from "../../controlers/LongPressController";

export class LongPressableBsIconBtnElement extends BsIconBtnElementMixin<
  Constructor<LitElement> & IBsIconBtnElementMixin
>(BsIconBtnElementMixinType) {
  static styles = [...BsIconBtnElement.styles];

  @property({ type: Boolean })
  public treatRightClickAsLongPress?: boolean;

  @property({ type: Number })
  public longPressIntervalMillis?: number;

  @property({ type: Number })
  public touchOrMouseMoveMinPx?: number;

  @property()
  public longPressableCssClass?: string;

  private thisInstn: IBsIconBtnElementMixin;

  private longPressController: LongPressController;

  constructor(...args: any[]) {
    super();
    this.thisInstn = this as any as IBsIconBtnElementMixin;

    this.longPressController = new LongPressController(this, {
      hostHtmlElementFactory: () => this,
      mainHtmlElementFactory: () => this.thisInstn.getBtnElem(),
      treatRightClickAsLongPress: this.treatRightClickAsLongPress,
      longPressIntervalMillis: this.longPressIntervalMillis,
      touchOrMouseMoveMinPx: this.touchOrMouseMoveMinPx,
    });

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.onShortPress = this.onShortPress.bind(this);
  }

  protected getButtonCssClassesArr() {
    // @ts-ignore
    const buttonCssClassesArr = super.getButtonCssClassesArr();

    if ((this.longPressableCssClass ?? "") !== "") {
      buttonCssClassesArr.push(this.longPressableCssClass);
    } else if (!this.thisInstn.btnHasNoBorder) {
      buttonCssClassesArr.push("trmrk-btn-long-press-enabled");
    }

    return buttonCssClassesArr;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.longPressController.touchStartEventListeners.subscribe(
      this.onTouchStart
    );

    this.longPressController.touchMoveEventListeners.subscribe(
      this.onTouchMove
    );

    this.longPressController.touchEndEventListeners.subscribe(this.onTouchEnd);

    this.longPressController.mouseDownEventListeners.subscribe(
      this.onMouseDown
    );

    this.longPressController.mouseMoveEventListeners.subscribe(
      this.onMouseMove
    );

    this.longPressController.mouseUpEventListeners.subscribe(this.onMouseUp);

    this.longPressController.longPressEventListeners.subscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.subscribe(
      this.onShortPress
    );
  }

  disconnectedCallback(): void {
    super.connectedCallback();

    this.longPressController.touchStartEventListeners.unsubscribe(
      this.onTouchStart
    );

    this.longPressController.touchMoveEventListeners.unsubscribe(
      this.onTouchMove
    );

    this.longPressController.touchEndEventListeners.unsubscribe(
      this.onTouchEnd
    );

    this.longPressController.mouseDownEventListeners.unsubscribe(
      this.onMouseDown
    );

    this.longPressController.mouseMoveEventListeners.unsubscribe(
      this.onMouseMove
    );

    this.longPressController.mouseUpEventListeners.unsubscribe(this.onMouseUp);

    this.longPressController.longPressEventListeners.unsubscribe(
      this.onLongPress
    );

    this.longPressController.shortPressEventListeners.unsubscribe(
      this.onShortPress
    );
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.longPressController.registerEventListeners();
  }

  onTouchStart(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("ontouchstart", evt));
  }

  onTouchMove(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("ontouchmove", evt));
  }

  onTouchEnd(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("ontouchend", evt));
  }

  onMouseDown(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("onmousedown", evt));
  }

  onMouseMove(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("onmousemove", evt));
  }

  onMouseUp(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("onmouseup", evt));
  }

  onLongPress(evt: LongPressEventData) {
    this.dispatchEvent(customEvent("onlongpress", evt));
  }

  onShortPress(evt: LongPressEventDataTuple) {
    this.dispatchEvent(customEvent("onshortpress", evt));
  }
}

customElements.define(
  "trmrk-long-pressable-bs-icon-btn",
  LongPressableBsIconBtnElement
);
