import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

import { AppLayoutStyles } from "../AppLayout/styles";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-ui-message")
export class UIMessageElement extends LitElement {
  static styles = [...globalStyles.value, ...AppLayoutStyles.value];

  @property()
  public paraCssClass?: string;

  @property()
  public message?: string;

  render() {
    return html`<p class="mt-1 ml-1 ${this.paraCssClass}">${this.message}</p>`;
  }
}
