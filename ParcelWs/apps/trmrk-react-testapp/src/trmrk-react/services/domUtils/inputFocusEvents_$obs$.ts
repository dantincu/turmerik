import { RefLazyValue } from "../../../trmrk/core";
import { IndexedCollection } from "../../../trmrk/indexed-collection";

import { filterChildElementsArr } from "../../../trmrk-browser/domUtils/core";
import { isSafari, isMobile } from "../../../trmrk-browser/domUtils/constants";
import { isTextInput } from "../../../trmrk-browser/domUtils/textInput";
import {
  getTouchOrMouseCoords,
  toSingleTouchOrClick,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import {
  bringTextInputCaretPositionerIntoView,
  clearTextInputCaretPositionerVertInset,
  retrieveTextInputCaretPositioner,
} from "../../components/textCaretPositionerV1/TextCaretInputPositionerV1";

export class InputFocusEventsHandler {
  public id = -1;

  constructor(
    public readonly nodesMx: (HTMLElement[] | NodeListOf<HTMLElement>)[],
    private readonly onShouldTogglePinnedToBottom: (
      shouldPinToBottom: boolean
    ) => void
  ) {
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  onFocusIn(e: FocusEvent) {
    this.registerClick(e);
    bringTextInputCaretPositionerIntoView();
  }

  onFocusOut(e: FocusEvent) {
    this.unregisterDocumentClick();
    this.unregisterClick(e);

    clearTextInputCaretPositionerVertInset();
  }

  onMouseDown(e: MouseEvent) {}

  registerClick(e: Event) {
    (e.target as HTMLElement).addEventListener("mousedown", this.onMouseDown);
  }

  unregisterClick(e: Event) {
    this.unregisterClickCore(e.target as HTMLElement);
  }

  unregisterClickCore(el: HTMLElement) {
    el.removeEventListener("mousedown", this.onMouseDown);
  }

  registerDocumentClick() {
    document.addEventListener("mouseup", this.onDocumentClick);
  }

  unregisterDocumentClick() {
    document.removeEventListener("mouseup", this.onDocumentClick);
  }

  onDocumentClick(ev: MouseEvent | TouchEvent) {
    let baseTmStmp = localStorage.getItem("baseTmStmp");
    let baseTmStmpVal: number;

    if (!baseTmStmp) {
      baseTmStmpVal = new Date().getTime();
      baseTmStmp = baseTmStmpVal.toString();
      localStorage.setItem("baseTmStmp", baseTmStmp);
    } else {
      baseTmStmpVal = parseInt(baseTmStmp);
    }

    const numberFormat = Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 6,
    });

    const tmpStmpStr = numberFormat.format(
      new Date().getTime() - baseTmStmpVal
    );

    const coords = toSingleTouchOrClick(getTouchOrMouseCoords(ev))!;
    const textCaretElem = retrieveTextInputCaretPositioner();

    if (textCaretElem) {
      const textCaretElemStyle = textCaretElem.style;

      localStorage.setItem(
        `${this.id}: textCaretElemStyle.top`,
        textCaretElemStyle.top.toString()
      );

      localStorage.setItem(
        `${this.id}: textCaretElemStyle.bottom`,
        textCaretElemStyle.bottom.toString()
      );

      if (
        ev.target instanceof HTMLElement &&
        !textCaretElem.contains(ev.target) &&
        isTextInput(ev.target as HTMLElement)
      ) {
        const bodyRect = document.body.getBoundingClientRect();
        // const caretRect = textCaretElem.getBoundingClientRect();

        localStorage.setItem(
          `${this.id}: bodyRect(${tmpStmpStr})`,
          JSON.stringify(
            [
              {
                "bodyRect.y": bodyRect.y,
                "bodyRect.top": bodyRect.top,
                "bodyRect.bottom": bodyRect.bottom,
                "window.innerHeight": window.innerHeight,
                "window.outerHeight": window.outerHeight,
                "document.body.clientHeight": document.body.clientHeight,
                "document.body.offsetHeight": document.body.offsetHeight,
                "document.body.clientTop": document.body.clientTop,
                "document.body.offsetTop": document.body.offsetTop,
                "window.safari": (window as any).safari ?? null,
                "navigator.userAgent": navigator.userAgent,
                coords: coords,
                isSafari: isSafari,
                isMobile: isMobile,
              },
            ],
            null,
            "  "
          )
        );

        const shouldTogglePinToBottom =
          bringTextInputCaretPositionerIntoView(textCaretElem, ev) ?? null;

        if (shouldTogglePinToBottom !== null) {
          localStorage.setItem(
            `${this.id}: ${new Date().getTime()}: shouldTogglePinToBottom`,
            shouldTogglePinToBottom.toString()
          );
          this.onShouldTogglePinnedToBottom(shouldTogglePinToBottom);
        }
      } else {
        this.unregisterDocumentClick();
        clearTextInputCaretPositionerVertInset(textCaretElem);
        localStorage.setItem(
          `${this.id}: targetIsNotInput(${tmpStmpStr})`,
          tmpStmpStr
        );
      }
    }
  }

  register() {
    const nodesMx = this.nodesMx;

    filterChildElementsArr<HTMLElement>(nodesMx, (node, i) => {
      localStorage.setItem(
        `${this.id}: ${new Date().getTime()}: register input(${i}).offsetTop`,
        node.offsetTop.toString()
      );
      node.addEventListener("focusin", this.onFocusIn);
      node.addEventListener("focusout", this.onFocusOut);
    });

    this.registerDocumentClick();
  }

  unregister() {
    const nodesMx = this.nodesMx;

    filterChildElementsArr<HTMLElement>(nodesMx, (node, i) => {
      localStorage.setItem(
        `${this.id}: ${new Date().getTime()}: unregister input(${i}).offsetTop`,
        node.offsetTop.toString()
      );
      node.removeEventListener("focusin", this.onFocusIn);
      node.removeEventListener("focusout", this.onFocusOut);
      this.unregisterClickCore(node);
    });

    this.unregisterDocumentClick();
  }
}

export class InputFocusEventsHandlersAgg {
  private readonly _handlersCollctn =
    new IndexedCollection<InputFocusEventsHandler>();

  register(
    nodesMx: (HTMLElement[] | NodeListOf<HTMLElement>)[],
    onShouldTogglePinnedToBottom: (shouldPinToBottom: boolean) => void
  ) {
    const newHandler = new InputFocusEventsHandler(
      nodesMx,
      onShouldTogglePinnedToBottom
    );

    newHandler.id = this._handlersCollctn.add(newHandler);
    newHandler.register();

    return newHandler.id;
  }

  unregister(id: number) {
    const handler = this._handlersCollctn.get(id).value!;
    handler.unregister();
  }
}

export const inputFocusEventsHandler =
  new RefLazyValue<InputFocusEventsHandlersAgg>(
    () => new InputFocusEventsHandlersAgg()
  );
