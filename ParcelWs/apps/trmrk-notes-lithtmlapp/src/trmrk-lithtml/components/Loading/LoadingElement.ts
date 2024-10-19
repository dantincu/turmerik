import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-loading")
export class LoadingElement extends LitElement {
  static styles = [...globalStyles.value];

  @property()
  public cssClass?: string;

  render() {
    return html`<div
      class="trmrk-loading-el trmrk-loading-el-dot-pulse ${this.cssClass}"
    ></div>`;
  }
}
