import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { IconVDomEl, TableRowCell, DriveItemsGridMainEditCell } from './driveItemsGridView.core.js';

export class DriveItemsGridEditRow extends VDomEl {
    mainEditCell = null;
    textBoxVDomEl = null;
    isReadonly = false;

    constructor(
        editCancelListener,
        editConfirmListener,
        deleteListener) {
        super({
            nodeName: "tr"
        });

        this.mainEditCell = new DriveItemsGridMainEditCell();
        this.mainEditCell.parentVDomEl = this;
        this.textBoxVDomEl = this.mainEditCell.textBoxVDomEl;

        editCancelListener = editCancelListener.bind(this);
        editConfirmListener = editConfirmListener.bind(this);
        deleteListener = deleteListener.bind(this);

        this.childNodes = [
            new TableRowCell(
                [ new IconVDomEl(
                    [ "oi", "oi-arrow-thick-left", trmrkCssClasses.rotate45Deg, trmrkCssClasses.icon ],
                    {
                        click: [{
                                listener: editCancelListener
                            }]
                    }) ],
                [ driveFolderViewCssClasses.gridCheckBoxCell ]),
            new TableRowCell(
                [ new IconVDomEl(
                    [ trmrkCssClasses.timesIcon ],
                    {
                        click: [{
                            listener: e => {
                                if (!this.isReadonly && e.button === 0) {
                                    this.textBoxVDomEl.domNode.value = "";
                                }
                            }
                        }]
                    },
                    "&times;") ],
                [ driveFolderViewCssClasses.gridIconCell ]),
            this.mainEditCell,
            new TableRowCell(
                [ new IconVDomEl(
                    [ "oi", "oi-arrow-circle-right", trmrkCssClasses.icon ],
                    {
                        click: [{
                            listener: editConfirmListener
                        }]
                    }) ],
                [ driveFolderViewCssClasses.gridIconCell ]),
            new TableRowCell(
                [ new IconVDomEl(
                    [ "oi", "oi-trash", trmrkCssClasses.icon ],
                    {
                        click: [{
                            listener: deleteListener
                        }]
                    }) ],
                [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }

    showError(error) {
        this.mainEditCell.showError(error);
    }

    clearError() {
        this.mainEditCell.hideError();
    }

    setReadonly() {
        this.isReadonly = true;
        this.addClass(trmrkCssClasses.waiting);
        this.textBoxVDomEl.addAttr("readonly", "readonly");
    }

    unsetReadonly() {
        this.isReadonly = false;
        this.removeClass(trmrkCssClasses.waiting);
        this.textBoxVDomEl.removeAttr("readonly");
    }
}
