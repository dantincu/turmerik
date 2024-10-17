import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import trmrk from "../../../trmrk";

import { AppLayoutStyles } from "../AppLayout/core";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-error-page")
export class ErrorElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  @property()
  public homePageUrl?: string;

  @property()
  public showHomePageBtn?: boolean;

  @property()
  public statusCode?: string;

  @property()
  public statusText?: string;

  render() {
    return html` <trmrk-app-page
      ?homePageUrl="${this.homePageUrl}"
      ?showHomePageBtn="${(this.showHomePageBtn ?? null) !== null}"
      appLayoutCssClass="app-error-page"
      appHeaderCssClass="trmrk-bottom-border-none h-48"
      homePageBtnClass="trmrk-bs-icon-btn-xl"
      homePageBtnHostClass="trmrk-bs-icon-btn-host-xl"
      appBodyCssClass="top-48"
    >
      <div slot="header-content" class="w-full">
        <label
          class="btn btn-danger display-inline-flex text-6xl mt-20 ml-[calc(50%-100px)]"
        >
          ${this.statusCode}
        </label>
      </div>
      <p slot="body-content" class="w-full text-center text-xl">
        ${trmrk.nullify(this.statusText?.trim()) ??
        "Ooops... something went wrong"}
      </p>
    </trmrk-app-page>`;
  }
}
