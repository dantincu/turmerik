import { LitElement, html } from "lit";
import { customElement } from "lit/decorators";

import { vaadinRouteGoEventControllerFactory } from "../../../trmrk-lithtml/controlers/VaadinRouteGoEventControllerFactory";

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

  protected readonly vaadinRouteGoEvent =
    vaadinRouteGoEventControllerFactory.createController(this);

  initializedFirstTime: boolean;
  loading: boolean;

  constructor() {
    super();
    this.initializedFirstTime = false;
    this.loading = false;
  }

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

  updated() {
    console.log("vaadinRouteGoEvent", this.vaadinRouteGoEvent.value);
  }

  firstUpdated() {
    console.log("vaadinRouteGoEvent", this.vaadinRouteGoEvent.value);
  }

  async initDataAsync() {
    if (!this.initializedFirstTime) {
      await this.reloadAsync();
    }
  }

  async reloadAsync() {}
}

@customElement("trmrk-folder-entries-list-footer-page")
export class FolderEntriesListPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
