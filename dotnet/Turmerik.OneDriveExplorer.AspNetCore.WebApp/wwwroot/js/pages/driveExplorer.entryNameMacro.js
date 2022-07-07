import { ValueWrapper } from '../common/core.js';
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

export const getBsToggleBtn = (targetSelector, btnText, btnClass) => {
    const bsToggleBtn = vdom.utils.getVDomEl("button",
        [ "btn", btnClass ], {
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": targetSelector
        }, [], {}, btnText);
    
    return bsToggleBtn;
}

export class EntryMacroDefVDomEl extends VDomEl {
    isFolder;
    driveItemOp;

    constructor(
        existingEntriesArr,
        driveItemOp,
        idxValueWrapper,
        onApplyItemEventHandler,
        macroName = null,
        nodeName = "li") {
        if (!trmrk.core.isNotNaNNumber(idxValueWrapper.value)) {
            throw "idxValueWrapper.value must be a number: " + idxValueWrapper.value;
        }

        idxValueWrapper.value++;
        const idxStr = idxValueWrapper.value.toString();
        
        const headerVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.header ], {}, [
                getBsToggleBtn("[data-trmrk-idx='" + idxStr + "']",
                    macroName ?? driveItemOp.nameMacro.macroName, "btn-outline-primary")
        ]);
        
        let applyMacroBtn = null;

        if (!trmrk.core.isOfTypeString(macroName)) {
            applyMacroBtn = vdom.utils.getVDomEl("button",
                [ "btn", "btn-primary" ], {
                    type: "button"
                }, [], {
                    click: [{
                        listener: onApplyItemEventHandler
                    }]
                }, "+");
            
            headerVDomEl.insertChildVNodeBefore(applyMacroBtn);
        }

        const mainContentVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.mainContent ], {}, []);

        const bodyNodes = [ mainContentVDomEl ];

        if (trmrk.core.isNotNullObj(driveItemOp.nameMacro)) {
            const mainContentVDomEl = vdom.utils.getVDomEl("p",
                [ trmrkCssClasses.description ],
                {}, [], {}, driveItemOp.nameMacro.macroDescription);

            const sampleText = driveItemNameMacroFactoryResolver.getName(
                existingEntriesArr, driveItemOp.nameMacro, true);

            const sampleTextVDomNode = vdom.utils.getVDomEl("pre",
                [ trmrkCssClasses.mainText ],
                {}, [], {}, sampleText);

            mainContentVDomEl.appendManyChildVNodes([
                mainContentVDomEl, sampleTextVDomNode ]);

            if (trmrk.core.isNotNullObj(driveItemOp.multipleDriveItemOps)) {
                const childVNodesArr = driveItemOp.multipleDriveItemOps.map(
                    item => new EntryMacroDefVDomEl(
                        trmrk.core.isNotNullObj(item.nameMacro) ? existingEntriesArr : null,
                        item, idxValueWrapper, onApplyItemEventHandler));

                const childNodesVDomEl = vdom.utils.getVDomEl("ul",
                    [ trmrkCssClasses.childNodes ], {}, childVNodesArr);

                bodyNodes.push(childNodesVDomEl);
            }
        }

        const bodyVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.body, "collapse" ],
            { "data-trmrk-idx": idxStr }, bodyNodes);

        super({
            nodeName: nodeName,
            classList: [ trmrkCssClasses.item ],
            childNodes: [
                headerVDomEl,
                bodyVDomEl
            ]
        });

        this.driveItemOp = driveItemOp;

        if (onApplyItemEventHandler) {
            applyMacroBtn.addEventListener("click", (function(e) {
                onApplyItemEventHandler.call(this, driveItemOp);
            }).bind(this));
        }

        this.createDomNode();
    }
}
