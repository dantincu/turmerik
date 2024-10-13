import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators";

import trmrk from "../../../trmrk";
import { Constructor } from "../../../trmrk/core";
import { propOf } from "../../../trmrk/obj";

import { ObservableValueController } from "../../controlers/ObservableValueController";
import { isDarkModePropFactory } from "../../domUtils/core";

import { globalStyles } from "../../domUtils/css";

import { updateDisableAttr } from "../../../trmrk-browser/domUtils/core";

const btnDisabledPropName = propOf<IBsIconBtnElementMixin>("btnDisabled");

export interface IBsIconBtnElementMixin extends LitElement {
  isDarkModeProp: ObservableValueController<boolean>;
  iconCssClass: string;
  btnCssClass?: string;
  btnHasNoBorder?: boolean;
  btnIsOutlinedAppTheme?: boolean;
  iconWrapperCssClass?: string;
  btnDisabled?: boolean;
  getBtnElem: () => HTMLButtonElement;
  getIconWrapperElem: () => HTMLSpanElement;
  shouldSetBtnOutlinedCssClass: () => boolean;
  getButtonCssClassesArr: () => string[];
}

export const BsIconBtnElementMixin = <
  T extends Constructor<LitElement> & IBsIconBtnElementMixin
>(
  superClass: T
) => {
  class MyMixinClass extends superClass {
    public readonly isDarkModeProp =
      isDarkModePropFactory.createController(this);

    private rippleTimeoutId: NodeJS.Timeout | null;

    constructor(...args: any[]) {
      super();
      this.rippleTimeoutId = null;
      this.onTouchEndOrMouseUp = this.onTouchEndOrMouseUp.bind(this);
      this.onTouchStartOrMouseDown = this.onTouchStartOrMouseDown.bind(this);
      this.onTouchOrMouseEvent = this.onTouchOrMouseEvent.bind(this);
    }

    @property()
    public iconCssClass!: string;

    @property()
    public btnCssClass?: string;

    @property({ type: Boolean })
    public btnHasNoRipple?: boolean;

    @property({ type: Boolean })
    public btnHasNoBorder?: boolean;

    @property({ type: Boolean })
    public btnIsOutlinedAppTheme?: boolean;

    @property()
    public iconWrapperCssClass?: string;

    @property({ type: Boolean })
    public btnDisabled?: boolean;

    public getBtnElem() {
      const btnElem = this.renderRoot.children[0] as HTMLButtonElement;
      return btnElem;
    }

    public getIconWrapperElem(btnElem?: HTMLButtonElement | null | undefined) {
      btnElem ??= this.getBtnElem();
      const iconWrapperElem = btnElem?.children[0] as HTMLSpanElement;
      return iconWrapperElem;
    }

    public get shouldSetBtnOutlinedCssClass() {
      return this.btnIsOutlinedAppTheme!;
    }

    public getButtonCssClassesArr() {
      const btnCssClassSfx = this.isDarkModeProp.observable.value
        ? "light"
        : "dark";

      const btnCssClassThemeName = this.isDarkModeProp.observable.value
        ? "dark"
        : "light";

      const buttonCssClassesArr = [
        "btn trmrk-bs-icon-btn trmrk-overflow-hidden",
        "trmrk-btn-theme-" + btnCssClassThemeName,
        this.shouldSetBtnOutlinedCssClass
          ? "btn-outline-" + btnCssClassSfx
          : null,
        this.btnHasNoBorder ? "trmrk-btn-no-border" : null,
        this.btnCssClass,
      ];

      return buttonCssClassesArr;
    }

    render() {
      const buttonCssClass = trmrk
        .removeNullOrUndef(this.getButtonCssClassesArr())
        .join(" ");

      return html`<button type="button" class="${buttonCssClass}">
        <span class="trmrk-icon-wrapper ${this.iconWrapperCssClass}"
          ><i class="${this.iconCssClass}"></i
        ></span>
      </button>`;
    }

    updated(changedProperties: PropertyValues) {
      const btnElem = this.getBtnElem();

      for (let propName in changedProperties) {
        if (propName === btnDisabledPropName) {
          updateDisableAttr(btnElem, this.btnDisabled!);
          break;
        }
      }

      btnElem.addEventListener("touchstart", this.onTouchStartOrMouseDown);
      btnElem.addEventListener("mousedown", this.onTouchStartOrMouseDown);
      btnElem.addEventListener("touchend", this.onTouchEndOrMouseUp);
      btnElem.addEventListener("mouseup", this.onTouchEndOrMouseUp);
    }

    firstUpdated(changedProperties: PropertyValues) {
      const btnElem = this.getBtnElem();
      updateDisableAttr(btnElem, this.btnDisabled!);
    }

    connectedCallback() {
      super.connectedCallback();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      const btnElem = this.getBtnElem();

      btnElem.removeEventListener("touchstart", this.onTouchStartOrMouseDown);
      btnElem.removeEventListener("mousedown", this.onTouchStartOrMouseDown);
      btnElem.removeEventListener("touchend", this.onTouchEndOrMouseUp);
      btnElem.removeEventListener("mouseup", this.onTouchEndOrMouseUp);
    }

    onTouchStartOrMouseDown(e: TouchEvent | MouseEvent) {
      this.onTouchOrMouseEvent(e);
    }

    onTouchEndOrMouseUp(e: TouchEvent | MouseEvent) {
      this.onTouchOrMouseEvent(e);
    }

    onTouchOrMouseEvent(e: TouchEvent | MouseEvent) {
      const callbackFactory = (add: boolean) => () => {
        const iconWrapperElem = this.getIconWrapperElem();
        if (add) {
          iconWrapperElem.classList.add("trmrk-ripple");
        } else {
          iconWrapperElem.classList.remove("trmrk-ripple");
        }
      };

      if (this.rippleTimeoutId) {
        clearTimeout(this.rippleTimeoutId);
        callbackFactory(false)();

        setTimeout(callbackFactory(true));
      } else {
        callbackFactory(true)();

        this.rippleTimeoutId = setTimeout(() => {
          callbackFactory(false)();
        }, 400);
      }
    }
  }

  return MyMixinClass as T;
};

export const BsIconBtnElementMixinType =
  LitElement as any as Constructor<LitElement> & IBsIconBtnElementMixin;

@customElement("trmrk-bs-icon-btn")
export class BsIconBtnElement extends BsIconBtnElementMixin(
  BsIconBtnElementMixinType
) {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-icon-wrapper {
        display: inline-flex;
        position: absolute;
        inset: 0px;
        justify-content: center;
        align-items: center;
      }

      .trmrk-bs-icon-btn {
        display: inline-flex;
        position: relative;
        width: 40px;
        height: 40px;
      }

      .trmrk-bs-icon-btn.trmrk-btn-no-border {
        border: 0;
      }

      .trmrk-bs-icon-btn.trmrk-btn-theme-light {
        border-color: #888;
      }

      .trmrk-bs-icon-btn.trmrk-btn-theme-dark {
        border-color: #888;
      }

      .trmrk-bs-icon-btn.trmrk-btn-long-press-enabled.trmrk-btn-theme-light {
        border: 2px solid #667;
      }

      .trmrk-bs-icon-btn.trmrk-btn-long-press-enabled.trmrk-btn-theme-dark {
        border: 2px solid #aaa;
      }

      .trmrk-bs-icon-btn[disabled].trmrk-btn-theme-light {
        border-color: #ccc;
      }

      .trmrk-bs-icon-btn[disabled].trmrk-btn-theme-dark {
        border-color: #444;
      }
    `,
  ];
}
