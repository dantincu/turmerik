import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings, DriveItemOp, DriveItemNameMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.core.js';
import { DriveItemsGridView } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';
import { driveItemNameMacroFactoryResolver } from './driveExplorer.entryNameMacro.factories.js';

export class MultipleEntriesNameMacroVDomEl extends VDomEl {
    currentFolder;
    existingEntries;
    entriesAreFolders;
    bodyVDomEl;
    addedEntries;

    constructor(currentFolder, entriesAreFolders = false, entriesToAdd = null) {
        let bodyVDomEl = vdom.utils.getVDomEl(
            "div", [ driveFolderViewCssClasses.multipleMacrosEditableBody ]);

        let headerChildNodes = [{
                nodeName: "h6",
                textValue: "Multiple" + entriesAreFolders ? "folders" : "files",
            }, {
                nodeName: "span",
                classList: [ trmrkCssClasses.minusIcon, trmrkCssClasses.icon ]
            }, {
                nodeName: "span",
                classList: [ "oi", "oi-file" ]
            }];

        if (entriesAreFolders) {
            headerChildNodes.push({
                nodeName: "span",
                classList: [ "oi", "oi-folder" ]
            });
        }

        super({
            nodeName: "div",
            classList: [ driveFolderViewCssClasses.multipleMacrosEditable ],
            childNodes: [
                {
                    nodeName: "div",
                    classList: [ driveFolderViewCssClasses.multipleMacrosEditableHeader ],
                    childNodes: headerChildNodes
                },
                bodyVDomEl
            ]
        });

        this.currentFolder = currentFolder || {
            subFolders: [],
            folderFiles: []
        };

        this.bodyVDomEl = bodyVDomEl;
        this.existingEntries = [];

        this.existingEntries.splice(0, 0, currentFolder.subFolders.map(
            item => item.name
        ));

        this.existingEntries.splice(0, 0, currentFolder.folderFiles.map(
            item => item.name
        ));

        this.entriesAreFolders = entriesAreFolders;
        this.addedEntries = [];

        if (trmrk.core.isNotNullObj(entriesToAdd)) {
            for (let entry of entriesToAdd) {
                this.addEntry(entry);
            }
        }
    }

    addEntry(entry) {
        var entryVDomEl = this.getEntryVDomEl(entry);
        this.bodyVDomEl.appendChildVNode(entryVDomEl);

        this.addedEntries.push(entry);
    }

    getEntryVDomEl(entry) {
        const vdomEl = new EntryNameMacroEditableVDomEl(
            entry.nameMacro, this.entriesAreFolders);

        return vdomEl;
    }
}