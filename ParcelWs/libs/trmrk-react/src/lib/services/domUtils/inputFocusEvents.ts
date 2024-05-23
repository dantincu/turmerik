import { RefLazyValue } from "../../../trmrk/core";

import { filterChildElementsArr } from "../../../trmrk-browser/domUtils/core";
import { isTextInput } from "../../../trmrk-browser/domUtils/textInput";

import {
  bringTextInputCaretPositionerIntoView,
  clearTextInputCaretPositionerVertInset,
  retrieveTextInputCaretPositioner,
} from "../../components/textCaretPositioner/TextCaretInputPositioner";

export class InputFocusEventsHandler {
  constructor() {
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  onFocusIn(e: FocusEvent) {
    bringTextInputCaretPositionerIntoView();
  }

  onFocusOut(e: FocusEvent) {
    this.unregisterDocumentClick();
    clearTextInputCaretPositionerVertInset();
  }

  registerDocumentClick() {
    // document.addEventListener("touchend", this.onDocumentClick);
    document.addEventListener("mouseup", this.onDocumentClick);
  }

  unregisterDocumentClick() {
    // document.removeEventListener("touchend", this.onDocumentClick);
    document.removeEventListener("mouseup", this.onDocumentClick);
  }

  onDocumentClick(e: MouseEvent | TouchEvent) {
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

    const textCaretElem = retrieveTextInputCaretPositioner();

    if (textCaretElem) {
      const textCaretElemStyle = textCaretElem.style;

      localStorage.setItem(
        "textCaretElemStyle.top",
        textCaretElemStyle.top.toString()
      );

      localStorage.setItem(
        "textCaretElemStyle.bottom",
        textCaretElemStyle.bottom.toString()
      );

      if (
        e.target instanceof HTMLElement &&
        !textCaretElem.contains(e.target) &&
        isTextInput(e.target as HTMLElement)
      ) {
        const bodyRect = document.body.getBoundingClientRect();

        localStorage.setItem(
          `bodyRect(${tmpStmpStr})`,
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
              },
            ],
            null,
            "  "
          )
        );
        bringTextInputCaretPositionerIntoView(textCaretElem);
      } else {
        this.unregisterDocumentClick();
        clearTextInputCaretPositionerVertInset(textCaretElem);
        localStorage.setItem(`targetIsNotInput(${tmpStmpStr})`, tmpStmpStr);
      }
    }
  }

  register(nodesMx: (HTMLElement[] | NodeListOf<HTMLElement>)[]) {
    filterChildElementsArr<HTMLElement>(nodesMx, (node, i) => {
      localStorage.setItem(
        `${new Date().getTime()}: register input(${i}).offsetTop`,
        node.offsetTop.toString()
      );
      node.addEventListener("focusin", this.onFocusIn);
      node.addEventListener("focusout", this.onFocusOut);
    });

    this.registerDocumentClick();
  }

  unregister(nodesMx: (HTMLElement[] | NodeListOf<HTMLElement>)[]) {
    filterChildElementsArr<HTMLElement>(nodesMx, (node, i) => {
      localStorage.setItem(
        `${new Date().getTime()}: unregister input(${i}).offsetTop`,
        node.offsetTop.toString()
      );
      node.removeEventListener("focusin", this.onFocusIn);
      node.removeEventListener("focusout", this.onFocusOut);
    });

    this.unregisterDocumentClick();
  }
}

export const inputFocusEventsHandler =
  new RefLazyValue<InputFocusEventsHandler>(
    () => new InputFocusEventsHandler()
  );
