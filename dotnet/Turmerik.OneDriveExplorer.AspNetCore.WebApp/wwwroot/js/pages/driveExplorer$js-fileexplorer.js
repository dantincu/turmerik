import { trmrk, webStorage, domUtils, bsDomUtils, imageFileNameExtensions } from '../common/main.js';
import { DriveItem, AppSettings, DriveItemOp, DriveItemNameMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';
import { DriveExplorerMacros } from './driveExplorer.macros.js';

export class DriveFolderApiResultWrapper {
    id = null;
    data = new DriveItem();
    entriesArr = null;
    apiResult = new TrmrkAxiosApiResult();
}

export class DriveExplorer {
    username = null;
    appSettings = new AppSettings();
    
    appRootVDomEl = new VDomEl();
    appRootChildVDomElms = [];

    currentDriveFolder = new DriveFolderApiResultWrapper();
    currentDriveFolderVDomEl = null;
    currentDriveFolderHeaderVDomEl = null;
    currentDriveFolderHeaderVDomElInitialOffset = null;

    currentDriveFolderStickyHeaderVDomEl = null;
    currentDriveFolderStickyHeaderVDomElAdded = false;

    fileExplorerVDomEl = null;
    fileExplorer = null;

    driveItemNameMacros = null;
    driveItemMacros = null;

    driveExplorerMacros = null;
    driveExplorerMacrosBsModal = null;

    async init(
        username,
        appSettings,
        driveItemNameMacros,
        driveItemMacros) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        this.driveItemNameMacros = driveItemNameMacros;
        this.driveItemMacros = driveItemMacros;

        driveExplorerApi.username = username;
        driveExplorerApi.appSettings = this.appSettings;
        webStorage.cacheKeyBasePrefix = this.appSettings.cacheKeyBasePrefix;

        this.generateAppRootChildVDomElms([]);
        this.appRootVDomEl = vdom.init("main", this.appRootChildVDomElms);
        this.currentDriveFolderHeaderVDomEl = this.getCurrentDriveFolderHeaderVDomEl(null, false);

        document.addEventListener("scroll", e => this.onDocumentScroll(e));
        window.addEventListener("resize", e => this.onWindowResize(e));
        
        window.addEventListener("popstate", e => this.onWindowPopState());
        await this.initFileExplorerAsync();
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

        rootElms.splice(0, 0, this.currentDriveFolderVDomEl);
        this.appRootChildVDomElms = rootElms;
    }

    assureCurrentDriveFolderMacrosModalVDomCreated() {
        if (!this.driveExplorerMacros) {
            this.driveExplorerMacros = new DriveExplorerMacros();

            const modalVDomEl = this.driveExplorerMacros.init(
                this.driveItemNameMacros,
                this.driveItemMacros,
                this.currentDriveFolder.data);

            this.currentDriveFolderVDomEl.appendChildVNode(modalVDomEl);
        }
    }

    convertDriveFolderToEntriesArr(driveFolder) {
        const foldersArr = this.convertDriveItemsToEntriesArr(driveFolder.subFolders);
        const filesArr = this.convertDriveItemsToEntriesArr(driveFolder.folderFiles);

        const entries = [];

        entries.splice(0, 0, foldersArr);
        entries.splice(0, 0, filesArr);

        return entries;
    }

    convertDriveItemsToEntriesArr(driveItemsArr) {
        const entriesArr = driveItemsArr = driveItemsArr.map(
            item => this.convertDriveItemToEntry(item)
        );

        return entriesArr;
    }

    convertDriveItemToEntry(driveItem) {
        const entry = {
            id: driveItem.id,
            hash: driveItem.id,
            name: driveItem.name,
            type: driveItem.isFolder ? "folder" : "file",
            attrs: { canmodify: true },
            size: driveItem.sizeBytesCount,
            thumb: this.getDriveItemThumb(driveItem)
        }
    }

    getDriveItemThumb(driveItem) {
        let thumb;

        if (driveItem.isFolder) {
            thumb = this.getDriveFolderThumb(driveItem);
        } else {
            thumb = this.getDriveFileThumb(driveItem);
        }

        return thumb;
    }

    getDriveFolderThumb(driveItem) {
    }

    getDriveFileThumb(driveItem) {
        driveItem.fileNameExtension = driveItem.fileNameExtension ?? this.getFileNameExtension(driveItem.name);
        let thumb = null;
        
        if (!driveItem.startsWith(".") && this.isImageFileNameExtension(driveItem.fileNameExtension)) {
            thumb = this.getDriveImageFileThumb(driveItem);
        }

        return thumb;
    }

    getFileNameExtension(fileName) {
        let lastDotIndexOf = fileName.lastIndexOf(".");
        let fileNameExtension = null;

        if (lastDotIndexOf >= 0) {
            fileNameExtension = fileName.substring(
                lastDotIndexOf + 1, fileName.length - lastDotIndexOf - 1);
        }

        return fileNameExtension;
    }

    isImageFileNameExtension(fileNameExtension) {
        let retVal = false;

        if (trmrk.core.isNonEmptyString(fileNameExtension)) {
            fileNameExtension = fileNameExtension.toLowerCase();
            retVal = imageFileNameExtensions.indexOf(fileNameExtension) >= 0;
        }

        return retVal;
    }

    getDriveImageFileThumb(driveItem) {
    }

    async initFileExplorerAsync() {
        this.fileExplorerVDomEl = vdom.utils.getVDomEl("div",
            [], { id: "fileExplorer" });

        const that = this;
        const folderId = trmrk.core.urlQuery.get(this.appSettings.driveFolderIdUrlQueryKey);

        var options = {
            initpath: [
                [ folderId, folderId, { canmodify: true } ]
            ],
            onrefresh: function(folder, refresh) {
                /* const $this = this;

                that.fileExplorerOnRefreshAsync(folder, refresh, this).then(
                    result => {
                    }, err => {
                        $this.SetNamedStatusBarText('folder', this.EscapeHTML(
                            'Failed to load folder.  ' + that.currentDriveFolder.apiResult.getStatusText()));
                    }
                ); */

                var xhr = new this.PrepareXHR({
				url: '/api/driveFolder/',
				params: {
					action: 'file_explorer_refresh',
					path: folder.id,
					xsrftoken: 'asdfasdf'
				},
				onsuccess: function(e) {
					var data = JSON.parse(e.target.response);
                    console.log(data);

                    if (data.success)  folder.SetEntries(data.entries);
                    else if (required)  $this.SetNamedStatusBarText('folder', $this.EscapeHTML('Failed to load folder.  ' + data.error));
                    },
                    onerror: function(e) {
                        // Maybe output a nice message if the request fails for some reason.
                        // if (required)  $this.SetNamedStatusBarText('folder', 'Failed to load folder.  Server error.');

                        console.log(e);
                    }
                });

                xhr.Send();
            },

            // This will be covered in a moment...
            // onrename: function(renamed, folder, entry, newname) {
            // },
        };

        this.fileExplorerVDomEl.createDomNode();
        this.fileExplorer = new window.FileExplorer(this.fileExplorerVDomEl.domNode, options);

        let driveFolderVDomElChildNodes = [
            this.currentDriveFolderHeaderVDomEl,
            this.fileExplorerVDomEl
        ];

        this.renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes);
        this.currentDriveFolderHeaderVDomElInitialOffset = domUtils.getCoords(this.currentDriveFolderHeaderVDomEl.domNode).top;

        this.fileExplorer.RefreshFolders();

        // await this.fileExplorerOnRefreshAsync(this.fileExplorer.GetCurrentFolder(), true, this.fileExplorer);
    }

    async fileExplorerOnRefreshAsync(folder, refresh, explorer) {
        if (refresh && folder === explorer.GetCurrentFolder())
        {
            this.currentDriveFolder.id = folder.id;
            const apiResult = await driveExplorerApi.getDriveFolderAsync(folder.id, false);
            
            this.currentDriveFolder.apiResult = apiResult;

            if (apiResult.isSuccess) {
                const folderData = apiResult.data;
                this.currentDriveFolder.data = folderData;

                this.currentDriveFolderHeaderVDomEl.setDriveFolderName(folderData);
                this.currentDriveFolder.entriesArr = this.convertDriveFolderToEntriesArr(folderData);

                folder.SetEntries(this.currentDriveFolder.entriesArr);
            } else {
                explorer.SetNamedStatusBarText('folder', this.EscapeHTML(
                    'Failed to load folder.  ' + apiResult.getStatusText()));
            }
        }
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

        let currentDriveFolderHeaderVDomEl = new DriveExplorerHeader(driveFolder, isSticky, events);
        return currentDriveFolderHeaderVDomEl;
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
        this.assureCurrentDriveFolderMacrosModalVDomCreated();
        this.driveExplorerMacros.bsModal.show();
    }

    onCurrentDriveFolderCommandsClick(e) {

    }

    onCurrentDriveFolderOpenInNewTabClick(e) {
        window.open(window.location.href);
    }

    renderCurrentDriveFolderViewCore(driveFolderVDomElChildNodes) {
        this.currentDriveFolderVDomEl.removeAllChildVNodes();
        this.driveExplorerMacros = null;

        for (let vNode of driveFolderVDomElChildNodes) {
            this.currentDriveFolderVDomEl.appendChildVNode(vNode);
        }
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
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
