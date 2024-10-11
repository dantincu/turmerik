import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

@customElement("trmrk-app-footer-bar")
export class AppFooterBarElement extends LitElement {
  static styles = [
    ...globalStyles.value,
    css`
      .trmrk-app-footer {
        display: flex;
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 48px;
        padding: 3px;
        cursor: pointer;
      }
    `,
  ];

  @property()
  cssClass?: string;

  render() {
    return html`<footer class="trmrk-app-footer ${this.cssClass}"></footer>`;
  }
}
