import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators";
import { Task } from "@lit/task";

import { DriveItem } from "../../../trmrk/drive-item";
import { TrmrkError } from "../../../trmrk/TrmrkError";
import { driveExplorerApi } from "../../services/DriveExplorerApi";
import { AxiosResponse, ApiResponse, ns } from "../../../trmrk-axios/core";
import { vaadinRouteGoEventControllerFactory } from "../../../trmrk-lithtml/controlers/VaadinRouteGoEventControllerFactory";
import { globalStyles } from "../../domUtils/css";
import { Components } from "../../../trmrk-lithtml/components";
import { updateAppPageProps, AppPage } from "../../utilities/data";
import { AppLayoutStyles } from "../../../trmrk-lithtml/components/AppLayout/core";

import { createAxiosReqDataTask } from "../../../trmrk-lithtml/tasks/AxiosReqDataTask";

export const AppComponents = {
  Components,
};

@customElement("trmrk-folder-entries-list-page")
export class FolderEntriesListPageElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];

  protected readonly vaadinRouteGoEvent =
    vaadinRouteGoEventControllerFactory.createController(this);

  @state()
  dataResp: ApiResponse<DriveItem> | null;

  @state()
  data: DriveItem | null;

  @state()
  itemPath: string;

  private _loadDataTask: Task<string[], DriveItem>;

  constructor() {
    super();
    this.dataResp = null;
    this.data = null;
    this.itemPath = new URLSearchParams(location.search).get("item-path") ?? "";

    this._loadDataTask = createAxiosReqDataTask({
      host: this,
      apiSvcCallAction: async ([itemPath], { signal }) => {
        return (await driveExplorerApi.value.GetFolder({
          path: itemPath,
        })) as DriveItem;
      },
      successCallback: (value) => {
        this.data = value;
      },
      errorCallback: (err) => {
        this.dataResp = err;
      },
      argsFunc: () => [this.itemPath],
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
    console.log("this.dataResp", this.dataResp);
    if (this.data) {
      return html``;
    } else if (this.dataResp) {
      return html`<h2 class="text-2xl text-danger">
          ${this.dataResp.errTitle}
        </h2>
        <p>${this.dataResp.errMessage}</p>`;
    } else {
      return html`<trmrk-loading
        class="relative left-4 top-1"
      ></trmrk-loading>`;
    }
  }
}

@customElement("trmrk-folder-entries-list-footer-page")
export class FolderEntriesListPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
