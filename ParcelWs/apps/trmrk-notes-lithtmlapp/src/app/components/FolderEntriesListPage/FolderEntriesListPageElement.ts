import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { Components } from "../../../trmrk-lithtml/components";

export const AppComponents = {
  Components,
};

@customElement("trmrk-folder-entries-list-page")
export class FolderEntriesListPageElement extends LitElement {
  static styles = [...globalStyles];

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <trmrk-app-layout>
        <div slot="header"></div>
        <main slot="body"></main>
        <div slot="footer"></div>
      </trmrk-app-layout>
    `;
  }
}
