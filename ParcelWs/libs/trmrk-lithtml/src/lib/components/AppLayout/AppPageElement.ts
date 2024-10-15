import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators";

import trmrk from "../../../trmrk";

import { updateHtmlDocTitle } from "../../../trmrk-browser/domUtils/core";

import { globalStyles } from "../../domUtils/css";

import { AppLayoutStyles } from "./core";

@customElement("trmrk-app-page")
export class AppPageElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  @property()
  public homePageUrl?: string;

  @property()
  public showHomePageBtn?: boolean;

  @property()
  public docTitle?: string;

  @property()
  public appLayoutCssClass?: string;

  @property()
  public appHeaderCssClass?: string;

  @property()
  public appBodyCssClass?: string;

  @property()
  public showAppFooter?: boolean;

  render() {
    console.log("this.showHomePageBtn", this.showHomePageBtn);

    return [
      html`<div class="trmrk-app-layout ${this.appLayoutCssClass}">
        <header class="trmrk-app-header ${this.appHeaderCssClass}">
          ${(this.showHomePageBtn ?? null) !== null
            ? html`<a
                class="trmrk-btn-link"
                href="${trmrk.nullify(this.homePageUrl?.trim()) ?? "/"}"
                ><trmrk-bs-icon-btn
                  btnHasNoBorder
                  iconCssClass="bi-house-door-fill"
                ></trmrk-bs-icon-btn
              ></a>`
            : null}
          <slot name="header"></slot>
        </header>
        <div class="trmrk-app-body trmrk-after-header ${this.appBodyCssClass}">
          <slot name="body"></slot>
        </div>
        ${this.showAppFooter
          ? html`<footer class="trmrk-app-footer">
              <slot name="footer"></slot>
            </footer>`
          : null}
      </div>`,
    ];
  }

  firstUpdated() {
    this.updateHtmlDocTitleIfReq();
  }

  updateHtmlDocTitleIfReq() {
    if (trmrk.nullify(this.docTitle?.trim() ?? null) !== null) {
      updateHtmlDocTitle(this.docTitle!);
    }
  }
}
