import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators";
import { Task } from "@lit/task";

import { DriveItem } from "../../../trmrk/drive-item";

import {
  AxiosResponse,
  AxiosConfig,
  ApiResponse,
} from "../../../trmrk-axios/core";

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

  @state()
  dataResp: AxiosResponse<DriveItem> | null;

  private _loadDataTask: Task<any, DriveItem>;

  constructor() {
    super();
    this.dataResp = null;

    this._loadDataTask = new Task(this, {
      task: async ([folderIdnf], { signal }) => {
        const response = await fetch(
          `http://example.com/product/${productId}`,
          {
            signal,
          }
        );
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json() as DriveItem;
      },
      args: () => [this.productId],
    });
  }

  connectedCallback() {
    super.connectedCallback();
    updateAppPageProps(AppPage.FolderEntriesList);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dataResp = null;
  }

  render() {
    return this._loadDataTask.render({
      pending: () => html`<p>Loading product...</p>`,
      complete: (product) => html`
        <h1>${product.name}</h1>
        <p>${product.price}</p>
      `,
      error: (e) => html`<p>Error: ${e}</p>`,
    });
  }
}

@customElement("trmrk-folder-entries-list-footer-page")
export class FolderEntriesListPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
