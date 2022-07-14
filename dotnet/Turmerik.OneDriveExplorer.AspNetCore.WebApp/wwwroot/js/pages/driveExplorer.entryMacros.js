import { DriveItemMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { trmrkCssClasses, driveFolderMacrosCssClasses } from './cssClasses.js';
import { getBsToggleButton } from '../common/BsToggleButtonVDomEl.js';

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