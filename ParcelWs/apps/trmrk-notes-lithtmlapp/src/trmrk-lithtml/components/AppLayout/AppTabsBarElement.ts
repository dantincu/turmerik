import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

@customElement("trmrk-app-tabs-bar")
export class AppTabsBarElement extends LitElement {
  @property()
  cssClass?: string;

  render() {
    return html`<nav class="navbar ${this.cssClass}"></nav>`;
  }
}
