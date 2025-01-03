import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators";

import trmrk from "../../../trmrk";
import { Constructor } from "../../../trmrk/core";

import { ObservableValueController } from "../../controlers/ObservableValueController";

import {
  rootElemAvaillableEvent,
  rootElemUnavaillableEvent,
} from "../../domUtils/core";

import { isDarkModePropFactory } from "../../dataStore/common";

import { globalStyles } from "../../domUtils/css";

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
      this.onTouchStartOrMouseDown = this.onTouchStartOrMouseDown.bind(this);
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

      return html`<button
        type="button"
        class="${buttonCssClass}"
        ?disabled="${this.btnDisabled}"
      >
        <span class="trmrk-icon-wrapper ${this.iconWrapperCssClass}"
          ><i class="${this.iconCssClass}"></i
        ></span>
      </button>`;
    }

    firstUpdated(changedProperties: PropertyValues) {
      this.rootElemAvaillable(this.getBtnElem());
    }

    updated(changedProperties: PropertyValues) {
      const btnElem = this.getBtnElem();

      btnElem.addEventListener("touchstart", this.onTouchStartOrMouseDown);
      btnElem.addEventListener("mousedown", this.onTouchStartOrMouseDown);

      this.rootElemAvaillable(btnElem);
    }

    connectedCallback() {
      super.connectedCallback();
      const btnElem = this.getBtnElem();

      if (btnElem) {
        this.rootElemAvaillable(btnElem);
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      const btnElem = this.getBtnElem();

      btnElem.removeEventListener("touchstart", this.onTouchStartOrMouseDown);
      btnElem.removeEventListener("mousedown", this.onTouchStartOrMouseDown);

      this.rootElemUnavaillable();
    }

    rootElemAvaillable(rootElem: HTMLButtonElement) {
      this.dispatchEvent(rootElemAvaillableEvent(rootElem));
    }

    rootElemUnavaillable() {
      this.dispatchEvent(rootElemUnavaillableEvent());
    }

    onTouchStartOrMouseDown(e: TouchEvent | MouseEvent) {
      const callbackFactory = (add: boolean) => () => {
        const iconWrapperElem = this.getIconWrapperElem();
        if (add) {
          iconWrapperElem?.classList.add("trmrk-ripple");
        } else {
          iconWrapperElem?.classList.remove("trmrk-ripple");
        }
      };

      if (!this.rippleTimeoutId) {
        callbackFactory(true)();

        this.rippleTimeoutId = setTimeout(() => {
          this.rippleTimeoutId = null;
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
      :host {
        display: inline-flex;
        position: relative;
        width: 40px;
        height: 40px;
        margin: 2px;
      }

      .trmrk-icon-wrapper {
        font-size: 20px;
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

      .trmrk-bs-icon-btn-xl {
        width: 80px;
        height: 80px;
      }

      .trmrk-bs-icon-btn-xl .trmrk-icon-wrapper {
        font-size: 40px;
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
