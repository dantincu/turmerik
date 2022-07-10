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

export const getBsToggleBtn = (targetSelector, btnText = "Toggle", btnClass = "btn-primary") => {
    const bsToggleBtn = vdom.utils.getVDomEl("button",
        [ "btn", btnClass ], {
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": targetSelector
        }, [], {}, btnText);
    
    return bsToggleBtn;
}

export class EntryMacroDefVDomElArgs extends ViewModelBase {
    name;
    isFolder;
    itemsArr;
    nameMacro;
    idxValueWrapper;
    existingEntriesArr;
    onApplyItemEventHandler;

    constructor(src) {
        super();
        this.__copyProps(src);
    }
}

export class EntryMacroDefVDomElBase extends VDomEl {
    opts = new EntryMacroDefVDomElArgs();
    idxStr;

    headerVDomEl;
    mainContentVDomEl;
    bodyNodes;
    bodyVDomEl;

    constructor(opts) {
        super({
            nodeName: "div"
        });

        this.opts = opts;

        if (!trmrk.core.isNotNaNNumber(this.opts.idxValueWrapper.value)) {
            throw "idxValueWrapper.value must be a number: " + this.opts.idxValueWrapper.value;
        }

        this.opts.idxValueWrapper.value++;
        this.idxStr = idxValueWrapper.value.toString();
        
        this.headerVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.header ], {}, [
                getBsToggleBtn("[data-trmrk-idx='" + this.idxStr + "']",
                    this.opts.name, "btn-outline-primary")
        ]);

        this.mainContentVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.mainContent ], {}, []);

        this.bodyNodes = [ this.mainContentVDomEl ];
    }
}

export class EntryMacroDefsGroupVDomEl extends EntryMacroDefVDomElBase {
    constructor(opts) {
        super(opts);
    }
}

export class EntryMacroDefVDomEl extends EntryMacroDefVDomElBase {
    applyMacroBtn;
    descriptionVDomEl;
    sampleTextVDomNode;

    constructor(opts) {
        super(opts);
        
        this.applyMacroBtn = vdom.utils.getVDomEl("button",
            [ "btn", "btn-primary" ], {
                type: "button"
            }, [], {
                click: [{
                    listener: onApplyItemEventHandler
                }]
            }, "+");
        
        this.headerVDomEl.insertChildVNodeBefore(this.applyMacroBtn);

        this.descriptionVDomEl = vdom.utils.getVDomEl("p",
            [ trmrkCssClasses.description ],
            {}, [], {}, this.opts.nameMacro.macroDescription);

        const sampleText = driveItemNameMacroFactoryResolver.getName(
            this.opts.existingEntriesArr, this.opts.nameMacro, true);

        this.sampleTextVDomNode = vdom.utils.getVDomEl("pre",
            [ trmrkCssClasses.mainText ],
            {}, [], {}, sampleText);

        this.mainContentVDomEl.appendManyChildVNodes([
            this.descriptionVDomEl, this.sampleTextVDomNode ]);

        if (trmrk.core.isNotNullObj(this.opts.itemsArr)) {
            const childVNodesArr = this.opts.itemsArr.map(
                item => new EntryMacroDefVDomEl(existingEntriesArr, item,
                    idxValueWrapper, onApplyItemEventHandler, item.nameMacro ? null : true));

            const childNodesVDomEl = vdom.utils.getVDomEl("ul",
                [ trmrkCssClasses.childNodes ], {}, childVNodesArr);

            bodyNodes.push(childNodesVDomEl);
        }

        const bodyVDomElClasses = [ trmrkCssClasses.body, "collapse" ];

        if (!isCollapsed) {
            bodyVDomElClasses.push("show");
        }

        const bodyVDomEl = vdom.utils.getVDomEl("div",
            bodyVDomElClasses,
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

    getChildVNode(childItem) {
        childVNode;

        if (trmrk.core.isNonEmptyString(
            childItem.item1) || trmrk.core.isNotNullObj(childItem.item2)) {

        } else {
            childVNode = new EntryMacroDefVDomEl({

            });
        }
    }
}
