import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators";

@customElement("trmrk-redirect")
export class RedirectElement extends LitElement {
  @property()
  public redirectTo!: string;

  render() {
    return html``;
  }

  updated() {
    window.history.pushState({}, "", this.redirectTo);
  }
}
