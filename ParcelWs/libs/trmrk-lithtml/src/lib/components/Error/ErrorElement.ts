import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import { AppLayoutStyles } from "../AppLayout/core";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-error")
export class ErrorElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  @property()
  public errTitle?: string;

  @property()
  public errMessage?: string;

  render() {
    return html`<trmrk-caption
        headerCssClass="text-danger"
        caption=${this.errTitle}
      ></trmrk-caption>
      <trmrk-ui-message message=${this.errMessage}></trmrk-ui-message>`;
  }
}
