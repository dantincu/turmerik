import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridView, DriveItemsGridViewTrmrkEvents, trmrkCssClasses } from './driveItemsGridView.js';

export class DriveFolderApiResultWrapper {
    id = null;
    data = new DriveItem();
    apiResult = new TrmrkAxiosApiResult();
}

export class DriveExplorer {
    username = null;
    appSettings = new AppSettings();
    
    appRootVDomEl = new VDomEl();
    appRootChildVDomElms = [];

    isEditMode = false;
    
    subFolderItemsGridVDomEl = null;
    fileItemsGridVDomEl = null;

    currentDriveFolder = new DriveFolderApiResultWrapper();
    currentDriveFolderVDomEl = null;

    async init(username, appSettings) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        driveExplorerApi.appSettings = this.appSettings;
        webStorage.cacheKeyBasePrefix = this.appSettings.CacheKeyBasePrefix;

        this.generateAppRootChildVDomElms();
        this.appRootVDomEl = vdom.init("main", this.appRootChildVDomElms);

        window.addEventListener("popstate", e => this.loadCurrentDriveFolderAsync());
        await this.loadCurrentDriveFolderAsync();
    }

    generateAppRootChildVDomElms() {
        this.currentDriveFolderVDomEl = new VDomEl({
            nodeName: "div",
            classList: [ "trmrk-drive-folder-view" ]
        });

        this.appRootChildVDomElms = [ this.currentDriveFolderVDomEl ];
    }

    async getCurrentDriveFolderAsync(folderId) {
        let folder = this.currentDriveFolder;
        folder.id = folderId;

        this.renderCurrendDriveFolderLoadingView();
        folder.apiResult = await driveExplorerApi.getDriveItemAsync(folderId);
        /* folder.apiResult.status = 404;
        folder.apiResult.statusText = "Page not Found";
        folder.apiResult.data = "The page you are looking for doesn't exist"; */

        if (folder.apiResult.isSuccess) {
            folder.data = folder.apiResult.data;
            this.renderCurrentDriveFolderView(folder.data);
        } else {
            this.renderCurrentDriveFolderErrorView(folder.apiResult);
        }
    }

    renderCurrentDriveFolderView(driveFolder) {
        let folderItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(true);
        let fileItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(false);

        const subFolderItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => this.navigateToFolderAsync(driveItem),
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, true),
            onEnterEditMode: () => this.onEnterEditMode(),
            onEnterExitMode: () => this.onExitEditMode()
        });

        const fileItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => {},
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, false),
            onEnterEditMode: () => this.onEnterEditMode(),
            onEnterExitMode: () => this.onExitEditMode()
        });

        this.subFolderItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.subFolders, true, subFolderItemsGridVDomElEvents);

        this.fileItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.folderFiles, false, fileItemsGridVDomElEvents);

        let driveFolderVDomElChildNodes = [
            folderItemsGridHeaderVDomEl,
            this.subFolderItemsGridVDomEl,
            fileItemsGridHeaderVDomEl,
            this.fileItemsGridVDomEl];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
    }

    getDriveItemsGridHeaderVDomEl(isFoldersGrid) {
        let that = this;

        let driveItemsGridHeaderVDomEl = vdom.utils.getVDomEl("h5", [], {}, [
            new VDomTextNode(isFoldersGrid ? "Folders " : "Files "),
            vdom.utils.getVDomEl("span",
                [ "oi", "oi-ellipses", "trmrk-rotate-90deg" ], {}, [], {
                    click: [{
                        listener: isFoldersGrid ? function(e) {
                            if (!that.isEditMode) {

                            }
                        } : function(e) {
                            if (!that.isEditMode) {
                                
                            }
                        }
                    }]
                })
        ]);

        return driveItemsGridHeaderVDomEl;
    }

    renderCurrentDriveFolderErrorView(apiResult) {
        let status = trmrk.core.toString(apiResult.status);
        let statusText = trmrk.core.toString(apiResult.statusText);
        let text = trmrk.core.toString(apiResult.data);

        let driveFolderVDomElChildNodes = [
            vdom.utils.getVDomEl("div", ["text-center"], {}, [
                vdom.utils.getVDomEl("h2", ["display-2", "fw-bold"], {}, [], {}, status),
                vdom.utils.getVDomEl("p", ["fs-3"], {}, [
                    vdom.utils.getVDomEl("span", ["text-danger"], {}, [], {}, "Oops! "),
                    new VDomTextNode(statusText)
                ]),
                vdom.utils.getVDomEl("p", ["lead"], {}, [], {}, text)
            ])];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
    }

    renderCurrendDriveFolderLoadingView() {
        let driveFolderVDomElChildNodes = [
            vdom.utils.getVDomEl("div", ["text-center"], {}, [
                vdom.utils.getVDomEl("p", ["fs-3"], {}, [], {}, "Loading...")
            ])];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
    }

    renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes) {
        this.currentDriveFolderVDomEl.removeAllChildVNodes();

        for (let vNode of driveFolderVDomElChildNodes) {
            this.currentDriveFolderVDomEl.appendChildVNode(vNode);
        }
    }

    async navigateToFolderAsync(item) {
        let driveItemId = encodeURIComponent(item.id);

        trmrk.core.urlQuery.set(
            this.appSettings.DriveFolderIdUrlQueryKey,
            driveItemId);

        let newQuery = trmrk.core.urlQuery.toString();
        trmrk.core.navigate(item.id, item.name, newQuery);

        await this.getCurrentDriveFolderAsync(item.id);
    }

    async loadCurrentDriveFolderAsync() {
        let folderId = trmrk.core.urlQuery.get(this.appSettings.DriveFolderIdUrlQueryKey);
        await this.getCurrentDriveFolderAsync(folderId);
    }

    async updateDriveItemNameAsync(driveItem, newName, isDriveFolder) {
        this.onEnterEditMode();
    }

    onEnterEditMode() {
        this.isEditMode = true;
        this.currentDriveFolderVDomEl.addClass(trmrkCssClasses.editMode);
    }

    onExitEditMode() {
        this.isEditMode = false;
        this.currentDriveFolderVDomEl.removeClass(trmrkCssClasses.editMode);
    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
