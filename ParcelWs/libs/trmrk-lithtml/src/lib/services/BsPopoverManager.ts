import * as bootstrap from "bootstrap";

import {
  PopoverPlacement,
  PopoverTrigger,
} from "../../trmrk-browser/bootstrapLib/core";

import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

export interface BsPopoverManagerOpts<THTMLElement extends HTMLElement> {
  triggerBtnAvaillableControllerFactory: ObservableValueSingletonControllerFactory<THTMLElement | null>;
  showPopoverControllerFactory: ObservableValueSingletonControllerFactory<boolean>;
  popoverDomElTagNameControllerFactory?:
    | ObservableValueSingletonControllerFactory<string>
    | null
    | undefined;
  popoverDomElFactory?: (() => HTMLElement) | null | undefined;
  placement?: (PopoverPlacement | (() => PopoverPlacement)) | null | undefined;
}

export class BsPopoverManager<THTMLElement extends HTMLElement>
  implements Disposable
{
  triggerBtnAvaillableControllerFactory!: ObservableValueSingletonControllerFactory<THTMLElement | null>;
  triggerBtn!: THTMLElement | null;

  showPopoverControllerFactory!: ObservableValueSingletonControllerFactory<boolean>;
  popoverDomElTagNameControllerFactory?:
    | ObservableValueSingletonControllerFactory<string>
    | null
    | undefined;
  popoverDomElFactory!: () => HTMLElement;
  placement: (PopoverPlacement | (() => PopoverPlacement)) | undefined;

  popover: bootstrap.Popover | null = null;
  popoverContentElem: HTMLElement | null = null;

  triggerBtnClickedWhenPopoverShown = false;

  constructor() {}

  public setup(opts: BsPopoverManagerOpts<THTMLElement>) {
    this.reset();

    this.triggerButtonClicked = this.triggerButtonClicked.bind(this);
    this.onTriggerBtnAvaillable = this.onTriggerBtnAvaillable.bind(this);
    this.onShowPopupChanged = this.onShowPopupChanged.bind(this);

    this.onDocumentClickedWhenPopoverShown =
      this.onDocumentClickedWhenPopoverShown.bind(this);

    this.removeOnDocumentClickedWhenPopoverShown =
      this.removeOnDocumentClickedWhenPopoverShown.bind(this);

    this.triggerBtnAvaillableControllerFactory =
      opts.triggerBtnAvaillableControllerFactory;

    this.triggerBtnAvaillableControllerFactory.observable.subscribe(
      this.onTriggerBtnAvaillable
    );

    this.triggerBtn = this.triggerBtnAvaillableControllerFactory.value;

    this.showPopoverControllerFactory = opts.showPopoverControllerFactory;

    this.showPopoverControllerFactory.observable.subscribe(
      this.onShowPopupChanged
    );

    this.popoverDomElTagNameControllerFactory =
      opts.popoverDomElTagNameControllerFactory;

    this.popoverDomElFactory =
      opts.popoverDomElFactory ??
      (() =>
        document.createElement(
          this.popoverDomElTagNameControllerFactory!.value
        ));

    this.placement = opts.placement ?? undefined;
  }

  public reset() {
    this.removeOnDocumentClickedWhenPopoverShown();

    this.triggerBtnAvaillableControllerFactory?.observable.unsubscribe(
      this.onTriggerBtnAvaillable
    );

    // @ts-ignore
    this.triggerBtnAvaillableControllerFactory = null;

    this.showPopoverControllerFactory?.observable.unsubscribe(
      this.onShowPopupChanged
    );

    // @ts-ignore
    this.showPopoverControllerFactory = null;

    // @ts-ignore
    this.popoverDomElFactory = null;

    // @ts-ignore
    this.placement = null;

    this.popover?.dispose();
    this.popover = null;

    this.popoverContentElem = null;
  }

  public triggerButtonClicked(e: MouseEvent) {
    if (!this.triggerBtnClickedWhenPopoverShown) {
      this.showPopoverControllerFactory.value = true;
    } else {
      this.triggerBtnClickedWhenPopoverShown = false;
    }
  }

  onTriggerBtnAvaillable(triggerBtn: THTMLElement | null) {
    this.triggerBtn = triggerBtn;
  }

  onShowPopupChanged(showPopup: boolean) {
    if (showPopup) {
      this.createOptionsPopoverIfReq();
      this.popover!.show();

      document.addEventListener(
        "click",
        this.onDocumentClickedWhenPopoverShown,
        {
          capture: true,
        }
      );
    } else {
      if (this.popover) {
        this.popover.hide();
        this.removeOnDocumentClickedWhenPopoverShown();
      }
    }
  }

  createOptionsPopoverIfReq() {
    if (!this.popover && this.triggerBtn) {
      const opts = {
        html: true,
        content: (this.popoverContentElem = this.popoverDomElFactory()),
        trigger: "manual" as PopoverTrigger,
        placement: this.placement,
      };

      if (!this.placement) {
        delete opts.placement;
      }

      this.popover = new bootstrap.Popover(this.triggerBtn, opts);
    }
  }

  removeOptionsPopoverIfReq() {
    if (this.popover) {
      this.popover.dispose();
      this.popover = null;
    }
  }

  onDocumentClickedWhenPopoverShown(e: MouseEvent) {
    var composedPathResult = e.composedPath();

    let hidePopup: boolean = true;

    if (this.popover && this.showPopoverControllerFactory.value) {
      if (this.popoverContentElem) {
        hidePopup = composedPathResult.indexOf(this.popoverContentElem) < 0;
      }
    }

    if (hidePopup) {
      if (this.triggerBtn) {
        if (composedPathResult.indexOf(this.triggerBtn) >= 0) {
          this.triggerBtnClickedWhenPopoverShown = true;
        }
      }

      this.showPopoverControllerFactory.value = false;
    }
  }

  removeOnDocumentClickedWhenPopoverShown() {
    document.removeEventListener(
      "click",
      this.onDocumentClickedWhenPopoverShown,
      {
        capture: true,
      }
    );
  }

  [Symbol.dispose]() {
    this.reset();
  }
}
