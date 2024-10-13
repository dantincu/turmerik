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
  btnHasNoBorder?: "true" | "false" | "";
  btnIsOutlinedAppTheme?: "true" | "false" | "";
  iconWrapperCssClass?: string;
  btnDisabled?: "true" | "false" | "";
  btnElem: HTMLButtonElement;
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

    @property()
    public iconCssClass!: string;

    @property()
    public btnCssClass?: string | null | undefined;

    @property({ type: Boolean })
    public btnHasNoBorder?: boolean | null | undefined;

    @property({ type: Boolean })
    public btnIsOutlinedAppTheme?: boolean | null | undefined;

    @property()
    public iconWrapperCssClass?: string | null | undefined;

    @property({ type: Boolean })
    public btnDisabled?: boolean | null | undefined;

    public btnElem!: HTMLButtonElement;

    public get shouldSetBtnOutlinedCssClass() {
      let btnIsOutlinedAppTheme = this.btnIsOutlinedAppTheme;
      let retVal = btnIsOutlinedAppTheme === true;

      if ((btnIsOutlinedAppTheme ?? null) === null) {
        retVal = (this.btnCssClass ?? "") === "";
      }

      return retVal;
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
      for (let propName in changedProperties) {
        if (propName === btnDisabledPropName) {
          updateDisableAttr(this.btnElem, this.btnDisabled === true);
          break;
        }
      }
    }

    firstUpdated(changedProperties: PropertyValues) {
      this.btnElem = this.renderRoot.children[0] as HTMLButtonElement;
      updateDisableAttr(this.btnElem, this.btnDisabled === true);
    }

    public getButtonCssClassesArr() {
      const btnCssClassSfx = this.isDarkModeProp.observable.value
        ? "light"
        : "dark";

      const btnCssClassThemeName = this.isDarkModeProp.observable.value
        ? "dark"
        : "light";

      const buttonCssClassesArr = [
        "btn trmrk-bs-icon-btn",
        "trmrk-btn-theme-" + btnCssClassThemeName,
        this.shouldSetBtnOutlinedCssClass
          ? "btn-outline-" + btnCssClassSfx
          : null,
        this.btnHasNoBorder === true ? "trmrk-btn-no-border" : null,
        this.btnCssClass,
      ];

      return buttonCssClassesArr;
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
        display: inline-block;
      }

      .trmrk-bs-icon-btn {
        margin: 2px;
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
