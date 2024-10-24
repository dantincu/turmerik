import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators";
import { Task } from "@lit/task";

import { getFileNameExtnWithoutLeadingDot } from "../../../../trmrk/notes-path";
import { DriveItem } from "../../../../trmrk/drive-item";
import { getBootstrapFileIcon } from "../../../../trmrk-browser/bootstrapLib/file-icons";
import { driveExplorerApi } from "../../../services/DriveExplorerApi";
import { AxiosResponse, ApiResponse, ns } from "../../../../trmrk-axios/core";
import { vaadinRouteGoEventControllerFactory } from "../../../../trmrk-lithtml/controlers/VaadinRouteGoEventControllerFactory";
import { globalStyles } from "../../../domUtils/css";
import { CoreComponents } from "../../../../trmrk-lithtml/components";
import { updateAppPageProps, AppPage } from "../../../utilities/data";
import { AppLayoutStyles } from "../../../../trmrk-lithtml/components/AppLayout/core";

import { createAxiosReqDataTask } from "../../../../trmrk-lithtml/tasks/AxiosReqDataTask";

export const AppComponents = {
  Components: CoreComponents,
};

@customElement("trmrk-folder-entries-list-page")
export class FolderEntriesListPageElement extends LitElement {
  static styles = [
    ...globalStyles,
    ...AppLayoutStyles.value,
    css`
      :host: {
        height: 100%;
        background-color: white;
      }
    `,
  ];

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
        const retItem = (await driveExplorerApi.value.GetFolder({
          path: itemPath,
        })) as DriveItem;

        return retItem;
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
    console.log("this.data", this.data);

    if (this.data) {
      if (this.data.SubFolders!.length || this.data.FolderFiles!.length) {
        return html`<trmrk-app-panel
          ><div class="trmrk-panel-content" slot="panel-content">
            ${this.data.SubFolders!.map(
              (folder) =>
                html`<trmrk-grid-item
                  iconCssClass="bi-folder-fill text-folder"
                  itemLabel="${folder.Name}"
                  itemDetails="Last accessed: ${folder.LastAccessTimeStr}"
                ></trmrk-grid-item>`
            )}${this.data.FolderFiles!.map(
              (file) => html`<trmrk-grid-item
                iconCssClass="${getBootstrapFileIcon(
                  getFileNameExtnWithoutLeadingDot(file.Name) ?? ""
                )}"
                itemLabel="${file.Name}"
                itemDetails="Last accessed: ${file.LastAccessTimeStr}"
              ></trmrk-grid-item>`
            )}
          </div></trmrk-app-panel
        >`;
      } else {
        return html`<trmrk-app-panel><trmrk-ui-message
          message="This folder is empty"
          slot="panel-content"
        ></trmrk-caption></trmrk-app-panel>`;
      }
    } else if (this.dataResp) {
      return html`<trmrk-app-panel
        ><trmrk-error
          errTitle=${this.dataResp.errTitle}
          errMessage=${this.dataResp.errMessage}
          slot="panel-content"
        >
        </trmrk-error
      ></trmrk-app-panel>`;
    } else {
      return html`<trmrk-app-panel
        ><trmrk-loading
          class="absolute left-4 top-1"
          slot="panel-content"
        ></trmrk-loading
      ></trmrk-app-panel>`;
    }
  }
}

@customElement("trmrk-folder-entries-list-footer-page")
export class FolderEntriesListPageFooterElement extends LitElement {
  static styles = [...globalStyles, ...AppLayoutStyles.value];
}
