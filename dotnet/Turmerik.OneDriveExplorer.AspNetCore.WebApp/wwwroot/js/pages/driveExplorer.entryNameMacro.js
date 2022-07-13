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
import { BsToggleButtonVDomEl, getBsToggleButton, BsToggleButtonOpts } from '../common/bsToggleButton.js';
import { driveItemNameMacroFactoryResolver } from './driveExplorer.entryNameMacro.factories.js';

export class DriveItemNameMacroDefPartVDomElOpts extends ViewModelBase {
    macro;
    existingEntryNamesArr;

    constructor(src) {
        super();
        this.__copyProps(src, true);
    }
};

export class DriveItemNameMacroDefPartVDomElBase extends VDomEl {
    macro;
    existingEntryNamesArr;

    constructor(opts, cssClass) {
        super({
            nodeName: "span",
            classList: [ cssClass ],
            textValue: driveItemNameMacroFactoryResolver.getName(
                this.existingEntryNamesArr, macro) + (macro.succeedingDelimiter ?? "")
        });

        this.opts = new DriveItemNameMacroDefPartVDomElOpts(opts);
        this.macro = new DriveItemNameMacro(this.opts.macro);

        this.existingEntryNamesArr = this.opts.existingEntryNamesArr;

        const textValue = driveItemNameMacroFactoryResolver.getName(
            this.existingEntryNamesArr, macro) + (macro.succeedingDelimiter ?? "");

        this.setTextValue(textValue);

    }
}

export class DriveItemNameMacroDefPartVDomEl extends DriveItemNameMacroDefPartVDomElBase {
    popoverBodyHtml;

    constructor(opts) {
        super(opts, driveFolderMacrosCssClasses.nameMacroPartContainer);

        const textValue = driveItemNameMacroFactoryResolver.getName(
            this.existingEntryNamesArr, macro) + (macro.succeedingDelimiter ?? "");

        this.setTextValue(textValue);
        this.popoverBodyHtml = this.popoverBodyHtml();

        this.onCreated = vEl => {
            new bootstrap.Popover(vEl.domNode, {
                container: vEl.domNode,
                html: [ '<div class="popover ',
                    driveFolderMacrosCssClasses.nameMacroPartPopoverContainer,
                    '" role="tooltip">',
                    '<div class="popover-arrow"></div>',
                    '<h3 class="popover-header"></h3>',
                    '<div class="popover-body">',
                    vEl.popoverBodyHtml,
                    '</div></div>' ].join("")
            })
        };
    }

    getPopoverBodyHtml() {
        const htmlPartsArr = ["<ul>"];

        if (trmrk.core.isNonEmptyString(this.macro.constName)) {

        }
    }

    addPopoverHtmlListItem(htmlPartsArr, html, cssClassList = []) {
        const cssClassesAttrValStr = [ '"', cssClassList.join(" ") , '"' ].join("");

        const cssClassAttrStr = ['class="', cssClassesAttrValStr, '">'].join("");
        const startTagStr = ['<li ', cssClassAttrStr, '>'].join("");

        const itemHtml = ['<li class="', cssClassesStr,
            '">', html, "</li>"].join("");
        
        itemHtml
    }
}

export class DriveItemNameMacroDefVDomEl extends DriveItemNameMacroDefPartVDomElBase {
    headerVDomEl;
    bodyVDomEl;

    constructor(opts) {
        super(opts, driveFolderMacrosCssClasses.nameMacroContainer);

        this.bodyVDomEl = this.getBodyVDomEl();
        this.headerVDomEl = this.getHeaderVDomEl();

        this.appendManyChildVNodes([
            this.headerVDomEl,
            this.bodyVDomEl
        ]);
    }

    getBodyVDomEl() {
        const bodyVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.body ], {},
            this.getBodyNodeVDomElms());

        return bodyVDomEl;
    }

    getHeaderVDomEl() {
        const headerVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.header ], {}, [
                vdom.utils.getVDomEl("label", [], {}, [], {}, this.macroName)
            ]);

        return headerVDomEl;
    }

    getBodyNodeVDomElms() {
        const bodyNodeVDomElms = [];
        let macro = this.macro;

        while (macro) {
            const vDomEl = new DriveItemNameMacroDefPartVDomEl({
                macro: macro,
                existingEntryNamesArr: this.existingEntryNamesArr
            });
            
            bodyNodeVDomElms.push(vDomEl);
            macro = macro.succeedingMacro;
        }
    }
}