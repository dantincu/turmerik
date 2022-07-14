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
import { BsToggleButtonVDomEl, getBsToggleButton, BsToggleButtonVDomElOpts } from '../common/BsToggleButtonVDomEl.js';
import { driveItemNameMacroFactoryResolver } from './driveExplorer.entryNameMacro.factories.js';

export class DriveItemNameMacroDefPartVDomElOpts extends BasicVDomElOpts {
    macro;
    existingEntryNamesArr;

    assignProps(src) {
        this.__copyProps(src);
        this.existingEntryNamesArr = this.existingEntryNamesArr ?? [];
    }
};

export class DriveItemNameMacroDefPartVDomElBase extends BasicVDomEl {
    macro;
    existingEntryNamesArr;

    assignOpts(opts) {
        this.opts = new DriveItemNameMacroDefPartVDomElOpts(opts);
        this.macro = new DriveItemNameMacro(this.opts.macro);
        this.existingEntryNamesArr = this.opts.existingEntryNamesArr;
    }
}

export class DriveItemNameMacroDefPartVDomEl extends DriveItemNameMacroDefPartVDomElBase {
    popoverBodyHtmlOptsArr;
    bsPopoverInstn;

    constructor(opts) {
        opts.nodeName = "span";
        opts.classList = [ trmrkCssClasses.part ];
        super(opts);
    }

    init() {
        const textValue = driveItemNameMacroFactoryResolver.getName(
            this.existingEntryNamesArr, macro) + (macro.succeedingDelimiter ?? "");

        this.setTextValue(textValue);
        this.popoverBodyHtmlOptsArr = this.getPopoverBodyHtmlOptsArr();

        this.onCreated = vEl => {
            const popoverHtml = bsDomUtils.getPopoverHtmlStr(
                this.popoverBodyHtmlOptsArr,
                this.opts.macro.macroName,
                driveFolderMacrosCssClasses.nameMacroPartPopoverContainer);

            this.bsPopoverInstn = new bootstrap.Popover(vEl.domNode, {
                container: vEl.domNode,
                html: popoverHtml
            });
        };
    }

    getPopoverBodyHtmlOptsArr() {
        const listItemsArr = [
            this.getPopoverHtmlListItem(
                "Src name first letter wrapping char",
                this.macro.srcNameFirstLetterWrappingChar
            ),
            this.getPopoverHtmlListItem(
                "Src name", this.macro.srcName
            ),
            this.getPopoverHtmlListItem(
                "Digits count", this.macro.digitsCount
            ),
            this.getPopoverHtmlListItem(
                "Min number", this.macro.minNumber
            ),
            this.getPopoverHtmlListItem(
                "Max number", this.macro.maxNumber
            ),
            this.getPopoverHtmlListItem(
                "Number seed", this.macro.numberSeed
            ),
            this.getPopoverHtmlListItem(
                "Const name", this.macro.constName
            ),
            this.getPopoverHtmlListItem(
                "Entry name", this.macro.entryName,
                val => !trmrk.core.isNullOrUndef(val)
            ),
            this.getPopoverHtmlListItem(
                "Preceeding delimiter", this.macro.preceedingDelimiter
            ),
            this.getPopoverHtmlListItem(
                "Succeeding delimiter", this.macro.succeedingDelimiter
            )
        ];

        const retArr = [{
            nodeName: "p",
            textValue: this.macroName.macroDescription
        }, {
            nodeName: "ul",
            childNodes: listItemsArr.filter(
                item => !(!item)
            )
        }];

        return retArr;
    }

    getPopoverHtmlListItem(name, value, condition, classList = []) {
        let retNode;
        condition = condition ?? (val => trmrk.core.isNonEmptyString(val, true));

        if (condition(value)) {
            retNode = {
                nodeName: "li",
                classList: classList,
                childNodes: [
                    domUtils.getTextDomElHtmlOpts(name + ": ",
                        [ trmrkCssClasses.name ], "span"),
                    domUtils.getTextDomElHtmlOpts(value,
                        [ trmrkCssClasses.value ], "span")
                ]
            };
        } else {
            retNode = null;
        }

        return retNode;
    }
}

export class DriveItemNameMacroDefVDomEl extends DriveItemNameMacroDefPartVDomElBase {
    headerVDomEl;
    bodyVDomEl;

    constructor(opts) {
        opts.nodeName = "div";
        opts.classList = [ driveFolderMacrosCssClasses.nameMacroContainer ];
        super(opts);
    }

    init() {
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