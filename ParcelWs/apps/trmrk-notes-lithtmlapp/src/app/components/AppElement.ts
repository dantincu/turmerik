import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators";

import { AppLayout } from "../../trmrk-lithtml/components/AppLayout";

export const AppComponents = {
  AppLayout,
};

import { globalStyles } from "../domUtils/css";
import { initDomAppTheme } from "../../trmrk-lithtml/domUtils/core";

initDomAppTheme();

@customElement("trmrk-app")
export class AppElement extends LitElement {
  static styles = [...globalStyles];

  render() {
    return html`
      <trmrk-app-layout>
        <nav class="navbar">
          <a class="navbar-brand" href="#">Navbar</a>
          <i class="bi-alarm"></i>
          <button class="btn btn-primary">asdf</button>
        </nav>
      </trmrk-app-layout>
    `;
  }
}
