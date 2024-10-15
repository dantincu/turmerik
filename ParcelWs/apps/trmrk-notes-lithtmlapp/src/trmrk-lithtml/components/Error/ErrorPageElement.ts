import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import trmrk from "../../../trmrk";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-error-page")
export class ErrorElement extends LitElement {
  static styles = [...globalStyles.value];

  @property()
  public homePageUrl?: string;

  @property()
  public showHomePageBtn?: boolean;

  @property()
  public statusCode?: string;

  @property()
  public statusText?: string;

  render() {
    console.log("this.showHomePageBtn", this.showHomePageBtn);

    return html` <trmrk-app-page
      ?homePageUrl="${this.homePageUrl}"
      ?showHomePageBtn="${(this.showHomePageBtn ?? null) !== null}"
      appHeaderCssClass="trmrk-bottom-border-none h-24"
      appBodyCssClass="top-24"
    >
      <div slot="header" class="w-full">
        <label
          class="btn btn-danger display-inline-flex text-4xl mt-4 ml-[calc(50%-60px)]"
        >
          ${this.statusCode}
        </label>
      </div>
      <p slot="body" class="w-full text-center text-xl">
        ${trmrk.nullify(this.statusText?.trim()) ??
        "Ooops... something went wrong"}
      </p>
    </trmrk-app-page>`;
  }
}
