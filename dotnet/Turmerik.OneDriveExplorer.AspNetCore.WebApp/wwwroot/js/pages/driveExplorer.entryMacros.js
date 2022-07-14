import { ValueWrapper } from '../common/core.js';
import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings, DriveItemOp, DriveItemNameMacro, DriveItemMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.core.js';
import { DriveItemsGridView } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses, driveFolderMacrosCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';
import { driveItemNameMacroFactoryResolver } from './driveExplorer.entryNameMacro.factories.js';
import { BasicVDomEl, BasicVDomElOpts } from '../common/BasicVDomEl.js';
import { getBsToggleButton, BsToggleButtonVDomElOpts, BsToggleButtonVDomEl } from '../common/BsToggleButtonVDomEl.js';

export class DriveItemMacroVDomElOpts extends ViewModelBase {
    macro;
    idxValueWrapper;
    existingEntryNamesArr;
    isFirstLevel = false;
    isCollapsed = true;
    isRootLevel = false;

    constructor(src) {
        super();
        this.__copyProps(src, true);
    }
}

export class DriveItemMacroVDomEl extends VDomEl {
    opts;
    macro;
    idx;
    idxStr;
    existingEntryNamesArr;
    isFirstLevel;
    isCollapsed;
    isRootLevel;

    headerVDomEl;
    bodyVDomEl;

    constructor(opts) {
        super({
            nodeName: "div",
            classList: [ driveFolderMacrosCssClasses.macroContainer ]
        });

        this.opts = new DriveItemMacroVDomElOpts(opts);
        this.macro = new DriveItemMacro(this.opts.macro);

        this.opts.idxValueWrapper.value++;
        this.idx = this.optsidxValueWrapper.value;
        this.idxStr = this.idx.toString();

        this.existingEntryNamesArr = this.opts.isFirstLevel ? this.opts.existingEntryNamesArr : [];

        this.isFirstLevel = this.opts.isFirstLevel;
        this.isCollapsed = this.opts.isCollapsed;
        this.isRootLevel = this.opts.isRootLevel;

        this.bodyVDomEl = this.getBodyVDomEl();
        this.headerVDomEl = this.getHeaderVDomEl();

        this.appendManyChildVNodes([
            this.headerVDomEl,
            this.bodyVDomEl
        ]);
    }

    getBodyVDomEl() {
        const bodyVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.body ], {}, [

            ]);

        return bodyVDomEl;
    }

    getHeaderVDomEl() {
        const headerVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.header ], {}, [
                getBsToggleButton("[data-trmrk-idx='" + this.idxStr + "']",
                    this.isCollapsed, this.bodyVDomEl, {
                        textValue: this.macro.name,
                        classList: [ "btn-dark" ] }, {
                        classList: [ "btn-outline-dark" ] })
            ]);

        return headerVDomEl;
    }
}