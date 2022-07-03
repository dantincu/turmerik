import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { TableHeaderCell } from './driveItemsGridView.core.js';

export class DriveItemsGridHeaderRow extends VDomEl {
    headerCheckBoxEl;
    isChecked = false;

    constructor(headerCheckBoxElEvents) {
        super({
            nodeName: "tr"
        });

        this.headerCheckBoxEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.partialCheckBox/* , trmrkCssClasses.unchecked */ ], {}, [
                vdom.utils.getVDomEl("div", [ trmrkCssClasses.square ], {}, [
                    vdom.utils.getVDomEl("span", [ "oi", "oi-check" ])
                ])
            ], headerCheckBoxElEvents);

        this.childNodes = [
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridCheckBoxCell ], [ this.headerCheckBoxEl ] ),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell("Name", [ driveFolderViewCssClasses.gridMainCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }

    check() {
        this.setCheckValue(true, trmrkCssClasses.checked);
    }

    uncheck() {
        this.setCheckValue(false, trmrkCssClasses.unChecked);
    }

    partiallyCheck() {
        this.setCheckValue(null, trmrkCssClasses.partiallyChecked);
    }

    setCheckValue(checked, cssClass) {
        this.checked = checked;
        this.headerCheckBoxEl.removeAllClasses();

        this.headerCheckBoxEl.push(trmrkCssClasses.partialCheckBox);
        this.headerCheckBoxEl.push(cssClass);
    }
}
