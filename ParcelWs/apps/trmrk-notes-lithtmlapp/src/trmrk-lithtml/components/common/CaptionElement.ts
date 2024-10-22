import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import { AppLayoutStyles } from "../AppLayout/core";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-caption")
export class CaptionElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  @property()
  public headerCssClass?: string;

  @property()
  public caption?: string;

  render() {
    return html`<h2 class="text-2xl ${this.headerCssClass} mt-1 ml-1">
      ${this.caption}
    </h2>`;
  }
}
