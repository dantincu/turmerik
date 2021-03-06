import { trmrk, webStorage, domUtils } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.core.js';
import { DriveItemsGridView } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';
import { DriveExplorerMacros } from './driveExplorer.macros.js';

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
    isAddNewFolder = false;
    isAddNewFile = false;
    isEditingCurrentFolder = false;
    isDeletingCurrentFolder = false;
    isMovingCurrentFolder = false;
    isCopyingCurrentFolder = false;
    
    subFolderItemsGridVDomEl = null;
    fileItemsGridVDomEl = null;

    currentDriveFolder = new DriveFolderApiResultWrapper();
    currentDriveFolderVDomEl = null;
    currentDriveFolderHeaderVDomEl = null;
    currentDriveFolderHeaderVDomElInitialOffset = null;

    currentDriveFolderStickyHeaderVDomEl = null;
    currentDriveFolderStickyHeaderVDomElAdded = false;

    currentlyEditedDriveItem = null;
    currentlyEditedOfficeFileType = null;

    driveItemNameMacros = null;
    driveItemMacros = null;

    driveExplorerMacros = new DriveExplorerMacros();

    async init(
        username,
        appSettings) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        driveExplorerApi.username = username;
        driveExplorerApi.appSettings = this.appSettings;
        webStorage.cacheKeyBasePrefix = this.appSettings.cacheKeyBasePrefix;

        this.generateAppRootChildVDomElms([]);
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
                    this.currentDriveFolderVDomEl.removeChildVNode(this.currentDriveFolderStickyHeaderVDomEl, true);
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

    generateAppRootChildVDomElms(rootElms) {
        this.currentDriveFolderVDomEl = new VDomEl({
            nodeName: "div",
            classList: [ driveFolderViewCssClasses.view ]
        });

        const modalVDomEl = this.driveExplorerMacros.init();        
        this.currentDriveFolderVDomEl.appendChildVNode(modalVDomEl);

        rootElms.splice(0, 0, this.currentDriveFolderVDomEl);
        this.appRootChildVDomElms = rootElms;
    }

    async assureCurrentDriveFolderMacrosModalVDomCreatedAsync() {
        if (!this.driveItemMacros) {
            let apiResult = await driveExplorerApi.getDriveItemMacrosAsync();
            apiResult = new TrmrkAxiosApiResult(apiResult);

            if (apiResult.isSuccess) {
                this.driveItemMacros = apiResult.data.macros;
                this.driveItemNameMacros = apiResult.data.nameMacros;                
            }

            this.driveExplorerMacros.updateModal(apiResult, this.currentDriveFolder);
        }
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
            onEnterEditMode: (driveItem) => this.onEnterEditMode(driveItem),
            onExitEditMode: () => this.onExitEditMode()
        });

        const fileItemsGridVDomElEvents = new DriveItemsGridViewTrmrkEvents({
            onNavigateToDriveItem: driveItem => {},
            onUpdateDriveItemName: (driveItem, newName) => this.updateDriveItemNameAsync(driveItem, newName, false),
            onDeleteItem: (driveItem) => this.deleteDriveItemAsync(driveItem, false),
            onEnterEditMode: (driveItem) => this.onEnterEditMode(driveItem),
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
        events.onCurrentDriveFolderMainCommandsClick = this.onCurrentDriveFolderMainCommandsClick.bind(this);
        events.onCurrentDriveFolderOptionsClick = this.onCurrentDriveFolderOptionsClick.bind(this);
        
        events.onCurrentDriveFolderCreateNewFolderClick = this.onCurrentDriveFolderCreateNewFolderClick.bind(this);
        events.onCurrentDriveFolderCreateNewTextFileClick = this.onCurrentDriveFolderCreateNewTextFileClick.bind(this);
        events.onCurrentDriveFolderCreateWithMacrosClick = this.onCurrentDriveFolderCreateWithMacrosClick.bind(this);
        events.onCurrentDriveFolderCommandsClick = this.onCurrentDriveFolderCommandsClick.bind(this);
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
        if (!this.currentDriveFolder.data.isRootFolder) {
            this.navigateToFolderIdAsync(null);
        }
    }

    onCurrentDriveFolderReloadClick(e) {
        this.getCurrentDriveFolderAsync(this.currentDriveFolder.data.id, true);
    }

    onCurrentDriveFolderGoUpClick(e) {
        if (!this.currentDriveFolder.data.isRootFolder) {
            this.navigateToFolderIdAsync(this.currentDriveFolder.data.parentFolderId)
        }
    }

    onCurrentDriveFolderMainCommandsClick(e) {

    }

    onCurrentDriveFolderOptionsClick(e) {

    }

    onCurrentDriveFolderCreateNewFolderClick(e) {
        this.isAddNewFolder = true;
        this.subFolderItemsGridVDomEl.startEditTableRow();
    }

    onCurrentDriveFolderCreateNewTextFileClick(e) {
        this.isAddNewFile = true;
        this.fileItemsGridVDomEl.startEditTableRow();
    }

    onCurrentDriveFolderCreateWithMacrosClick(e) {
        this.driveExplorerMacros.bsModal.show();
        this.assureCurrentDriveFolderMacrosModalVDomCreatedAsync();
    }

    onCurrentDriveFolderCommandsClick(e) {

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
                this.appSettings.driveFolderIdUrlQueryKey,
                folderId);
        } else {
            trmrk.core.urlQuery.delete(
                this.appSettings.driveFolderIdUrlQueryKey
            );
        }

        let newQuery = trmrk.core.urlQuery.toString();
        trmrk.core.navigate(newQuery);

        await this.getCurrentDriveFolderAsync(folderId);
    }

    async loadCurrentDriveFolderAsync() {
        let folderId = trmrk.core.urlQuery.get(this.appSettings.driveFolderIdUrlQueryKey);
        await this.getCurrentDriveFolderAsync(folderId);
    }

    async updateDriveItemNameAsync(driveItem, newName, isDriveFolder) {
        let apiResult, isUpdate = trmrk.core.isNotNullObj(driveItem);
        const parentFolder = this.currentDriveFolder.data;

        if (isUpdate) {
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
        }

        if (apiResult.isSuccess) {
            if (isUpdate) {
                sessionStorage.removeItem(driveItem.id);

                if (isDriveFolder) {
                    this.updateDriveItemNameCore(this.subFolderItemsGridVDomEl, apiResult.data);
                    this.replaceDriveItem(parentFolder.subFolders, driveItem, apiResult.data)
                } else {
                    this.updateDriveItemNameCore(this.fileItemsGridVDomEl, apiResult.data);
                    this.replaceDriveItem(parentFolder.folderFiles, driveItem, apiResult.data)
                }

                driveItem = apiResult.data;
            } else {
                driveItem = apiResult.data;

                if (isDriveFolder) {
                    parentFolder.subFolders.push(driveItem);
                    this.addDriveItemCore(this.subFolderItemsGridVDomEl, driveItem);
                } else {
                    parentFolder.folderFiles.push(driveItem);
                    this.addDriveItemCore(this.fileItemsGridVDomEl, driveItem);
                }
            }
            
            driveExplorerApi.setDriveFolderToCache(driveItem, parentFolder.id);
            driveExplorerApi.setDriveFolderToCache(parentFolder);
        } else {
            if (isDriveFolder) {
                this.showApiErrorPopover(apiResult, this.subFolderItemsGridVDomEl.editRow);
            } else {
                this.showApiErrorPopover(apiResult, this.fileItemsGridVDomEl.editRow);
            }
        }
    }

    updateDriveItemNameCore(itemsGridVDomEl, driveItem) {
        itemsGridVDomEl.currentRow.updateDriveItem(driveItem);
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
        const parentFolder = this.currentDriveFolder.data;

        if (isDriveFolder) {
            apiResult = await driveExplorerApi.removeDriveFolderAsync(driveItem.id);
        } else {
            apiResult = await driveExplorerApi.removeDriveFileAsync(driveItem.id);
        }

        if (apiResult.isSuccess) {
            if (isDriveFolder) {
                this.removeDriveItem(parentFolder.subFolders, driveItem);
                this.deleteDriveItemCore(this.subFolderItemsGridVDomEl);
            } else {
                this.removeDriveItem(parentFolder.folderFiles, driveItem);
                this.deleteDriveItemCore(this.fileItemsGridVDomEl);
            }
                
            driveExplorerApi.setDriveFolderToCache(parentFolder);
            driveExplorerApi.removeDriveFolderFromCache(driveItem);
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

    onEnterEditMode(driveItem) {
        this.isEditMode = true;
        this.currentlyEditedDriveItem = driveItem;

        if (trmrk.core.isNotNullObj(driveItem)) {
            this.currentlyEditedOfficeFileType = driveItem.officeLikeFileType;
        }
        
        this.currentDriveFolderVDomEl.addClass(trmrkCssClasses.editMode);

        this.subFolderItemsGridVDomEl.enterEditMode(true);
        this.fileItemsGridVDomEl.enterEditMode(true);
    }

    onExitEditMode() {
        this.isEditMode = false;
        this.isAddNewFolder = false;
        this.isAddNewFile = false;
        this.currentlyEditedDriveItem = null;
        this.currentlyEditedOfficeFileType = null;
        this.currentDriveFolderVDomEl.removeClass(trmrkCssClasses.editMode);

        this.subFolderItemsGridVDomEl.exitEditMode(true);
        this.fileItemsGridVDomEl.exitEditMode(true);
    }

    showApiErrorPopover(apiResult, editRow) {
        let errorMessage = apiResult.statusText;

        if (trmrk.core.isNotNullObj(apiResult.exc)) {
            errorMessage = apiResult.exc.message;
        }
        
        editRow.showError(errorMessage);
        editRow.unsetReadonly();
    }

    validateEditRowText(textValue) {
        textValue = trmrk.core.strValOrDefault(textValue, "").trim();
        let validation = new Validation(true);

        if (trmrk.core.isNonEmptyString(textValue)) {
            let driveItemId = this.currentDriveFolder.data.id;
            let officeLikeFileType = null;

            if (trmrk.core.isNotNullObj(this.currentlyEditedDriveItem)) {
                driveItemId = this.currentlyEditedDriveItem.id;
                officeLikeFileType = this.currentlyEditedDriveItem.officeLikeFileType;
            }

            try {
                driveExplorerApi.validateDriveItemIdAndNewName(
                    driveItemId,
                    textValue,
                    officeLikeFileType);
            } catch (err) {
                validation = new Validation(false, err);
            }

            if (validation.isValid) {
                validation = this.validateDriveItemNameUnique(
                    this.currentDriveFolder.data.subFolders,
                    textValue, "A folder with the same name already exists"
                );
            }

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

    replaceDriveItem(driveItemsArr, prevDriveItem, newDriveItem) {
        const kvp = trmrk.core.firstOrDefault(
            driveItemsArr,
            item => item.id === prevDriveItem.id
        );

        if (kvp.key >= 0) {
            driveItemsArr.splice(kvp.key, 1, newDriveItem);
            console.log("Replaced drive item with id " + prevDriveItem.id);
        } else {
            console.log("Could not find drive item with id " + prevDriveItem.id);
        }
    }

    removeDriveItem(driveItemsArr, driveItem) {
        const kvp = trmrk.core.firstOrDefault(
            driveItemsArr,
            item => item.id === driveItem.id
        );

        if (kvp.key >= 0) {
            driveItemsArr.splice(kvp.key, 1);
            console.log("Removed drive item with id " + driveItem.id);
        } else {
            console.log("Could not find drive item with id " + driveItem.id);
        }
    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
