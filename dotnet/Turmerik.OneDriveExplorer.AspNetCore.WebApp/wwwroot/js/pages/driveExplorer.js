import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi, driveItemOpEnum } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridView, DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';

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
        folder.apiResult = await driveExplorerApi.getDriveFolderAsync(folderId, refreshCache);

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
            onDeleteItem: (driveItem) => this.deleteDriveItemAsync(driveItem, true),
            onEnterEditMode: () => this.onEnterEditMode(),
            onExitEditMode: () => this.onExitEditMode()
        });

        const fileItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => {},
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, false),
            onDeleteItem: (driveItem) => this.deleteDriveItemAsync(driveItem, false),
            onEnterEditMode: () => this.onEnterEditMode(),
            onExitEditMode: () => this.onExitEditMode()
        });

        this.currentDriveFolderHeaderVDomEl = currentDriveFolderHeaderVDomEl;
        this.currentDriveFolderStickyHeaderVDomEl = currentDriveFolderStickyHeaderVDomEl;

        this.currentDriveFolderStickyHeaderVDomEl.createDomNode();

        this.subFolderItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.subFolders, true, subFolderItemsGridVDomElEvents,
            textValue => this.validateEditRowText(textValue));

        this.fileItemsGridVDomEl = new DriveItemsGridView(
            driveFolder.folderFiles, false, fileItemsGridVDomElEvents,
            textValue => this.validateEditRowText(textValue));

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
        const events = new DriveExplorerHeaderEvents();

        events.onExpandCurrentDriveFolderTitle = this.onExpandCurrentDriveFolderTitle.bind(this);
        events.onCollapseCurrentDriveFolderTitle = this.onCollapseCurrentDriveFolderTitle.bind(this);
        events.onCurrentDriveFolderHomeClick = this.onCurrentDriveFolderHomeClick.bind(this);
        events.onCurrentDriveFolderReloadClick = this.onCurrentDriveFolderReloadClick.bind(this);
        events.onCurrentDriveFolderGoUpClick = this.onCurrentDriveFolderGoUpClick.bind(this);
        events.onCurrentDriveFolderOptionsClick = this.onCurrentDriveFolderOptionsClick.bind(this);
        events.onCurrentDriveFolderEditClick = this.onCurrentDriveFolderEditClick.bind(this);
        events.onCurrentDriveFolderCreateNewWithMacroClick = this.onCurrentDriveFolderCreateNewWithMacroClick.bind(this);
        events.onCurrentDriveFolderCreateNewFolderClick = this.onCurrentDriveFolderCreateNewFolderClick.bind(this);
        events.onCurrentDriveFolderCreateNewOfficeFileClick = this.onCurrentDriveFolderCreateNewOfficeFileClick.bind(this);
        events.onCurrentDriveFolderOpenInNewTabClick = this.onCurrentDriveFolderOpenInNewTabClick.bind(this);

        let currentDriveFolderTitleVDomEl = new DriveExplorerHeader(driveFolder, isSticky, events);
        return currentDriveFolderTitleVDomEl;
    }

    onExpandCurrentDriveFolderTitle(e) {
        this.currentDriveFolderHeaderVDomEl.expandTitle();
        this.currentDriveFolderStickyHeaderVDomEl.expandTitle();
    }

    onCollapseCurrentDriveFolderTitle(e) {
        this.currentDriveFolderHeaderVDomEl.collapseTitle();
        this.currentDriveFolderStickyHeaderVDomEl.collapseTitle();
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

    onCurrentDriveFolderEditClick(e) {

    }

    onCurrentDriveFolderCreateNewWithMacroClick(e) {

    }

    onCurrentDriveFolderCreateNewFolderClick(e) {
        this.isAddNew = true;
        this.subFolderItemsGridVDomEl.startEditTableRow();
    }

    onCurrentDriveFolderCreateNewTextFileClick(e) {
        this.isAddNew = true;
        this.fileItemsGridVDomEl.startEditTableRow();
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
        let apiResult, isUpdate = trmrk.core.isNotNullObj(driveItem);
        const parentFolder = this.currentDriveFolder.data;

        apiResult = new TrmrkAxiosApiResult();
        apiResult.isSuccess = true;

        /* if (isUpdate) {
            if (isDriveFolder) {
                apiResult = await driveExplorerApi.updateDriveFolderNameAsync(driveItem.id, newName);
            } else {
                apiResult = await driveExplorerApi.updateDriveFileNameAsync(driveItem.id, newName);
            }
        } else {
            if (isDriveFolder) {
                apiResult = await driveExplorerApi.addDriveFolderAsync(parentFolder.id, newName);
            } else {
                apiResult = await driveExplorerApi.addDriveFileAsync(parentFolder.id, newName);
            }
        } */

        if (apiResult.isSuccess) {
            if (isUpdate) {
                driveItem.name = newName;

                if (isDriveFolder) {
                    this.updateDriveItemNameCore(this.subFolderItemsGridVDomEl, newName);
                } else {
                    this.updateDriveItemNameCore(this.fileItemsGridVDomEl, newName);
                }
            } else {
                driveItem = apiResult.data;

                if (isDriveFolder) {
                    this.currentDriveFolder.data.subFolders.push(driveItem);
                    this.addDriveItemCore(this.subFolderItemsGridVDomEl, driveItem);
                } else {
                    this.currentDriveFolder.data.folderFiles.push(driveItem);
                    this.addDriveItemCore(this.fileItemsGridVDomEl, driveItem);
                }
            }
        } else {
            if (isDriveFolder) {
                this.showApiErrorPopover(apiResult, this.subFolderItemsGridVDomEl.editRow);
            } else {
                this.showApiErrorPopover(apiResult, this.fileItemsGridVDomEl.editRow);
            }
        }
    }

    updateDriveItemNameCore(itemsGridVDomEl, newName) {
        itemsGridVDomEl.currentRow.updateDriveItemName(newName);
        itemsGridVDomEl.editRow.unsetReadonly();
        itemsGridVDomEl.endEditTableRow();
    }

    addDriveItemCore(itemsGridVDomEl, driveItem) {
        itemsGridVDomEl.addTableRow(driveItem);
        itemsGridVDomEl.editRow.unsetReadonly();
        itemsGridVDomEl.endEditTableRow();
    }

    async deleteDriveItemAsync(driveItem, isDriveFolder) {
        let apiResult;

        apiResult = new TrmrkAxiosApiResult();
        apiResult.isSuccess = true;

        /* if (isDriveFolder) {
            apiResult = await driveExplorerApi.removeDriveFolderAsync(driveItem.id);
        } else {
            apiResult = await driveExplorerApi.removeDriveFileAsync(driveItem.id);
        } */

        if (apiResult.isSuccess) {
            if (isDriveFolder) {
                this.removeDriveItem(this.currentDriveFolder.data.subFolders, driveItem);
                this.deleteDriveItemCore(this.subFolderItemsGridVDomEl);
            } else {
                this.removeDriveItem(this.currentDriveFolder.data.folderFiles, driveItem);
                this.deleteDriveItemCore(this.fileItemsGridVDomEl);
            }
        } else {
            if (isDriveFolder) {
                this.showApiErrorPopover(apiResult, this.subFolderItemsGridVDomEl.editRow);
            } else {
                this.showApiErrorPopover(apiResult, this.fileItemsGridVDomEl.editRow);
            }
        }
    }

    deleteDriveItemCore(itemsGridVDomEl) {
        itemsGridVDomEl.currentRow.removeDomNode();
        itemsGridVDomEl.currentRow = null;

        itemsGridVDomEl.editRow.unsetReadonly();
        itemsGridVDomEl.endEditTableRow();
    }

    enterEditMode() {
        this.subFolderItemsGridVDomEl.isEditMode = true;
        this.fileItemsGridVDomEl.isEditMode = true;

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
        this.isAddNew = false;
        this.currentDriveFolderVDomEl.removeClass(trmrkCssClasses.editMode);

        this.subFolderItemsGridVDomEl.exitEditMode(true);
        this.fileItemsGridVDomEl.exitEditMode(true);
    }

    showApiErrorPopover(apiResult, editRow) {
        editRow.showError(apiResult.statusText);
        editRow.unsetReadonly();
    }

    validateEditRowText(textValue) {
        textValue = trmrk.core.strValOrDefault(textValue, "").trim();
        let validation;

        if (trmrk.core.isNonEmptyString(textValue)) {
            validation = this.validateDriveItemNameUnique(
                this.currentDriveFolder.data.subFolders,
                textValue, "A folder with the same name already exists"
            );

            if (validation.isValid) {
                validation = this.validateDriveItemNameUnique(
                    this.currentDriveFolder.data.folderFiles,
                    textValue, "A file with the same name already exists"
                );
            }
        } else {
            validation = new Validation(false, "Entry name cannot be empty");
        }

        return validation;
    }

    validateDriveItemNameUnique(driveItemsArr, trgName, errorMessage) {
        let validation = null;
            
        for (let existing of driveItemsArr) {
            if (trmrk.core.stringsEqualIgnoreCase(existing.name, trgName)) {
                validation = new Validation(false, errorMessage);
                break;
            }
        }

        if (!trmrk.core.isNotNullObj(validation)) {
            validation = new Validation(true, null);
        }

        return validation;
    }

    removeDriveItem(driveItemsArr, driveItem) {
        const kvp = trmrk.core.firstOrDefault(
            driveItemsArr,
            item => item.id === driveItem.id
        );

        if (kvp.Key >= 0) {
            driveItemsArr.splice(kvp.Key, 1);
            console.log("Removed drive item with id " + driveItem.id);
        } else {
            console.log("Could not find drive item with id " + driveItem.id);
        }
    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
