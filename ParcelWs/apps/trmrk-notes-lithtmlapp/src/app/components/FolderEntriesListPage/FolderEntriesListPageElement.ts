import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { globalStyles } from "../../domUtils/css";

import { Components } from "../../../trmrk-lithtml/components";

import { appPagePropFactory, AppPage } from "../../utilities/data";

import {
  AppLayoutStyles,
  showAppHeaderPropFactory,
  showAppHeaderHistoryNavButtonsPropFactory,
  showAppTabsBarPropFactory,
  showAppHeaderOptiosButtonPropFactory,
  enableExplorerPanelPropFactory,
  showAppFooterPropFactory,
} from "../../../trmrk-lithtml/components/AppLayout/core";

export const AppComponents = {
  Components,
};

@customElement("trmrk-folder-entries-list-page")
export class FolderEntriesListPageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  connectedCallback() {
    super.connectedCallback();
    showAppHeaderPropFactory.observable.value = true;
    enableExplorerPanelPropFactory.observable.value = true;
    showAppTabsBarPropFactory.observable.value = true;
    showAppHeaderHistoryNavButtonsPropFactory.observable.value = true;
    showAppHeaderOptiosButtonPropFactory.observable.value = true;
    showAppFooterPropFactory.observable.value = false;
    appPagePropFactory.observable.value = AppPage.FolderEntriesList;
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
