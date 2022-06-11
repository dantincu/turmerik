import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridView, DriveItemsGridViewTrmrkEvents, trmrkCssClasses, driveFolderViewCssClasses } from './driveItemsGridView.js';

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
    isAddNew = false;
    
    subFolderItemsGridVDomEl = null;
    fileItemsGridVDomEl = null;

    currentDriveFolder = new DriveFolderApiResultWrapper();
    currentDriveFolderVDomEl = null;
    currentDriveFolderHeaderVDomEl = null;
    currentDriveFolderHeaderVDomElInitialOffset = null;

    currentDriveFolderStickyHeaderVDomEl = null;
    currentDriveFolderStickyHeaderVDomElAdded = false;

    async init(username, appSettings) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        driveExplorerApi.appSettings = this.appSettings;
        webStorage.cacheKeyBasePrefix = this.appSettings.CacheKeyBasePrefix;

        this.generateAppRootChildVDomElms();
        this.appRootVDomEl = vdom.init("main", this.appRootChildVDomElms);

        document.addEventListener("scroll", e => this.onDocumentScroll(e));
        window.addEventListener("resize", e => this.onWindowResize(e));
        window.addEventListener("popstate", e => this.onWindowPopState());

        await this.loadCurrentDriveFolderAsync();
    }

    onDocumentScroll(e) {
        const initialOffset = this.currentDriveFolderHeaderVDomElInitialOffset;

        if (this.currentDriveFolderHeaderVDomEl) {
            if (document.body.scrollTop > initialOffset || document.documentElement.scrollTop > initialOffset) {
                if (!this.currentDriveFolderStickyHeaderVDomElAdded) {
                    this.currentDriveFolderStickyHeaderVDomElAdded = true;
                    this.currentDriveFolderHeaderVDomEl.addAttr("visibility", "hidden");
                    this.currentDriveFolderVDomEl.appendChildVNode(this.currentDriveFolderStickyHeaderVDomEl);
                }
            } else {
                if (this.currentDriveFolderStickyHeaderVDomElAdded) {
                    this.currentDriveFolderStickyHeaderVDomElAdded = false;
                    this.currentDriveFolderVDomEl.removeChildVNode(this.currentDriveFolderStickyHeaderVDomEl);
                    this.currentDriveFolderHeaderVDomEl.removeAttr("visibility");
                }
            }
        }
    }

    onWindowResize(e) {
        this.currentDriveFolderHeaderVDomElInitialOffset = domUtils.getCoords(this.currentDriveFolderHeaderVDomEl.domNode).top;
    }

    onWindowPopState(e) {
        trmrk.core.urlQuery = new URLSearchParams(window.location.search);
        this.loadCurrentDriveFolderAsync()
    }

    generateAppRootChildVDomElms() {
        this.currentDriveFolderVDomEl = new VDomEl({
            nodeName: "div",
            classList: [ driveFolderViewCssClasses.view ]
        });

        this.appRootChildVDomElms = [ this.currentDriveFolderVDomEl ];
    }

    async getCurrentDriveFolderAsync(folderId, refreshCache) {
        let folder = this.currentDriveFolder;
        folder.id = folderId;

        this.renderCurrendDriveFolderLoadingView();
        folder.apiResult = await driveExplorerApi.getDriveItemAsync(folderId, refreshCache);

        if (folder.apiResult.isSuccess) {
            folder.data = folder.apiResult.data;
            this.renderCurrentDriveFolderView(folder.data);
        } else {
            this.renderCurrentDriveFolderErrorView(folder.apiResult);
        }
    }

    renderCurrentDriveFolderView(driveFolder) {
        const currentDriveFolderHeaderVDomEl = this.getCurrentDriveFolderHeaderVDomEl(driveFolder, false);
        const currentDriveFolderStickyHeaderVDomEl = this.getCurrentDriveFolderHeaderVDomEl(driveFolder, true);
        const folderItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(true);
        const fileItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(false);

        const subFolderItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => this.navigateToFolderIdAsync(driveItem.id),
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, true),
            onEnterEditMode: () => this.onEnterEditMode(),
            onExitEditMode: () => this.onExitEditMode()
        });

        const fileItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => {},
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, false),
            onEnterEditMode: () => this.onEnterEditMode(),
            onExitEditMode: () => this.onExitEditMode()
        });

        this.currentDriveFolderHeaderVDomEl = currentDriveFolderHeaderVDomEl;
        this.currentDriveFolderStickyHeaderVDomEl = currentDriveFolderStickyHeaderVDomEl;

        this.currentDriveFolderStickyHeaderVDomEl.createDomNode();

        this.subFolderItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.subFolders, true, subFolderItemsGridVDomElEvents);

        this.fileItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.folderFiles, false, fileItemsGridVDomElEvents);

        let driveFolderVDomElChildNodes = [
            currentDriveFolderHeaderVDomEl,
            folderItemsGridHeaderVDomEl,
            this.subFolderItemsGridVDomEl,
            fileItemsGridHeaderVDomEl,
            this.fileItemsGridVDomEl];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
        this.currentDriveFolderHeaderVDomElInitialOffset = domUtils.getCoords(currentDriveFolderHeaderVDomEl.domNode).top;
    }

    getCurrentDriveFolderHeaderVDomEl(driveFolder, isSticky) {
        let headerCssClass = isSticky ? driveFolderViewCssClasses.stickyHeader : driveFolderViewCssClasses.header;

        let currentDriveFolderTitleVDomEl = vdom.utils.getVDomEl(
            "div", [ headerCssClass ], {}, [
            vdom.utils.getVDomEl("h6", [], {}, [], {}, driveFolder.name),
            vdom.utils.getVDomEl("div", [ trmrkCssClasses.iconsRow ], {}, [
                vdom.utils.getVDomEl("span", [ "oi", "oi-home", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderHomeClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-reload", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderReloadClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-arrow-circle-top", trmrkCssClasses.icon ], {}, [],
                    this.getMouseClickEvent(this.onCurrentDriveFolderGoUpClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-ellipses", "trmrk-rotate-90deg", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderOptionsClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-command", trmrkCssClasses.icon ], {}, [],
                    this.getMouseClickEvent(this.onCurrentDriveFolderCreateNewWithMacroClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-arrow-thick-top", "trmrk-rotate-45deg", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderOpenInNewTabClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-folder", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderCreateNewFolderClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-file", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(this.onCurrentDriveFolderCreateNewTextFileClick)),
                vdom.utils.getVDomEl("span", [ trmrkCssClasses.plusIcon, trmrkCssClasses.icon ], {}, "+", 
                    this.getMouseClickEvent(this.onCurrentDriveFolderCreateNewOfficeFileClick)),
            ]),
        ]);

        return currentDriveFolderTitleVDomEl;
    }

    getMouseClickEvent(callback) {
        const that = this;

        const event = {
            click: [{
                listener: function(e) {
                    if (e.button === 0 && !that.isEditMode) {
                        callback.call(that, e);
                    }
                }
            }]
        };

        return event;
    }

    onCurrentDriveFolderHomeClick(e) {
        this.navigateToFolderIdAsync(null);
    }

    onCurrentDriveFolderReloadClick(e) {
        this.getCurrentDriveFolderAsync(this.currentDriveFolder.data.id, true);
    }

    onCurrentDriveFolderGoUpClick(e) {
        this.navigateToFolderIdAsync(this.currentDriveFolder.data.parentFolderId)
    }

    onCurrentDriveFolderOptionsClick(e) {

    }

    onCurrentDriveFolderCreateNewWithMacroClick(e) {

    }

    onCurrentDriveFolderCreateNewFolderClick(e) {
        this.isAddNew = true;
        this.subFolderItemsGridVDomEl.start();
    }

    onCurrentDriveFolderCreateNewTextFileClick(e) {
        this.isAddNew = true;
        this.fileItemsGridVDomEl.enterEditMode();
    }

    onCurrentDriveFolderCreateNewOfficeFileClick(e) {

    }

    onCurrentDriveFolderOpenInNewTabClick(e) {
        window.open(window.location.href);
    }

    getDriveItemsGridHeaderVDomEl(isFoldersGrid) {
        let driveItemsGridHeaderVDomEl = vdom.utils.getVDomEl(
            "h5", [], {}, [], {}, isFoldersGrid ? "Folders " : "Files ");

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

    async navigateToFolderIdAsync(folderId) {
        if (trmrk.core.isNonEmptyString(folderId)) {
            trmrk.core.urlQuery.set(
                this.appSettings.DriveFolderIdUrlQueryKey,
                folderId);
        } else {
            trmrk.core.urlQuery.delete(
                this.appSettings.DriveFolderIdUrlQueryKey
            );
        }

        let newQuery = trmrk.core.urlQuery.toString();
        trmrk.core.navigate(newQuery);

        await this.getCurrentDriveFolderAsync(folderId);
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

        this.subFolderItemsGridVDomEl.enterEditMode(true);
        this.fileItemsGridVDomEl.enterEditMode(true);
    }

    onExitEditMode() {
        this.isEditMode = false;
        this.currentDriveFolderVDomEl.removeClass(trmrkCssClasses.editMode);

        this.subFolderItemsGridVDomEl.exitEditMode(true);
        this.fileItemsGridVDomEl.exitEditMode(true);
    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
