import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../domUtils/css";
import { initDomAppTheme } from "../../trmrk-lithtml/domUtils/core";

import { Components } from "../../trmrk-lithtml/components";

export const AppComponents = {
  Components,
};

initDomAppTheme();

@customElement("trmrk-app")
export class AppElement extends LitElement {
  static styles = [...globalStyles];

  render() {
    return html`
      <trmrk-app-layout appTitle="Turmerik Notes"></trmrk-app-layout>
    `;
  }
}
