import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { Components } from "../../../trmrk-lithtml/components";

import { updateAppPageProps, AppPage } from "../../utilities/data";

import { AppLayoutStyles } from "../../../trmrk-lithtml/components/AppLayout/core";

export const AppComponents = {
  Components,
};

@customElement("trmrk-folder-entries-list-page")
export class FolderEntriesListPageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  connectedCallback() {
    super.connectedCallback();
    updateAppPageProps(AppPage.FolderEntriesList);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<div>asdfasdf</div>`;
  }
}

@customElement("trmrk-folder-entries-list-footer-page")
export class FolderEntriesListPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
