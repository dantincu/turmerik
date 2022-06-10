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
    
    subFolderItemsGridVDomEl = null;
    fileItemsGridVDomEl = null;

    currentDriveFolder = new DriveFolderApiResultWrapper();
    currentDriveFolderVDomEl = null;
    currentDriveFolderTitleVDomEl = null;
    currentDriveFolderTitleVDomElInitialOffset = null;

    async init(username, appSettings) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        driveExplorerApi.appSettings = this.appSettings;
        webStorage.cacheKeyBasePrefix = this.appSettings.CacheKeyBasePrefix;

        this.generateAppRootChildVDomElms();
        this.appRootVDomEl = vdom.init("main", this.appRootChildVDomElms);

        document.addEventListener("scroll", e => this.onDocumentScroll(e));
        window.addEventListener("popstate", e => this.loadCurrentDriveFolderAsync());

        await this.loadCurrentDriveFolderAsync();
    }

    onDocumentScroll(e) {
        var body = document.body,
        html = document.documentElement;

        const height = Math.max(
            body.scrollHeight,
            body.offsetHeight, 
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight );
        
        const halfHeight = height / 2;
        const initialOffset = this.currentDriveFolderTitleVDomElInitialOffset;

        if (this.currentDriveFolderTitleVDomEl) {
            if (document.body.scrollTop > initialOffset || document.documentElement.scrollTop > initialOffset) {
                if (document.body.scrollTop > halfHeight || document.documentElement.scrollTop > halfHeight) {
                    this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.header);
                    this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.stickyFooter);
                    this.currentDriveFolderTitleVDomEl.addClass(driveFolderViewCssClasses.stickyHeader);
                } else {
                    this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.header);
                    this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.stickyHeader);
                    this.currentDriveFolderTitleVDomEl.addClass(driveFolderViewCssClasses.stickyFooter);
                }
            } else {
                this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.stickyFooter);
                this.currentDriveFolderTitleVDomEl.removeClass(driveFolderViewCssClasses.stickyHeader);
                this.currentDriveFolderTitleVDomEl.addClass(driveFolderViewCssClasses.header);
            }
        }
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

        if (folder.apiResult.isSuccess) {
            folder.data = folder.apiResult.data;
            this.renderCurrentDriveFolderView(folder.data);
        } else {
            this.renderCurrentDriveFolderErrorView(folder.apiResult);
        }
    }

    renderCurrentDriveFolderView(driveFolder) {
        const currentDriveFolderTitleVDomEl = this.getCurrentDriveFolderTitleVDomEl(driveFolder);
        const folderItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(true);
        const fileItemsGridHeaderVDomEl = this.getDriveItemsGridHeaderVDomEl(false);

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

        this.currentDriveFolderTitleVDomEl = currentDriveFolderTitleVDomEl;

        this.subFolderItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.subFolders, true, subFolderItemsGridVDomElEvents);

        this.fileItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.folderFiles, false, fileItemsGridVDomElEvents);

        let driveFolderVDomElChildNodes = [
            currentDriveFolderTitleVDomEl,
            folderItemsGridHeaderVDomEl,
            this.subFolderItemsGridVDomEl,
            fileItemsGridHeaderVDomEl,
            this.fileItemsGridVDomEl];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
        this.currentDriveFolderTitleVDomElInitialOffset = this.getCoords(currentDriveFolderTitleVDomEl.domNode).top;
    }

    getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    getCurrentDriveFolderTitleVDomEl(driveFolder) {
        let that = this;

        let currentDriveFolderTitleVDomEl = vdom.utils.getVDomEl(
            "h6", [driveFolderViewCssClasses.header], {}, [
            new VDomTextNode(driveFolder.name),
            vdom.utils.getVDomEl("span",
                [ "oi", "oi-ellipses", "trmrk-rotate-90deg", trmrkCssClasses.icon ], {}, [], {
                    click: [{
                        listener: function(e) {
                            if (!that.isEditMode) {
                                
                            }
                        }
                    }]
                }), vdom.utils.getVDomEl("span",
                [ trmrkCssClasses.plusIcon ], {}, "+", {
                    click: [{
                        listener: function(e) {
                            if (!that.isEditMode) {
                                
                            }
                        }
                    }]
                })
        ]);

        return currentDriveFolderTitleVDomEl;
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
