import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { ViewModelBase } from '../common/ViewModelBase.js';

export class Validation {
    isValid = false;
    error = null;

    constructor(isValid, error) {
        this.isValid = isValid;
        this.error = error;
    }
}

export class IconVDomEl extends VDomEl {
    constructor(classList, events, innerHTML) {
        super({
            nodeName: "span",
            classList: classList,
            events: events,
            childNodes: innerHTML
        });
    }
}

export class DriveItemNameVDomEl extends VDomEl {
    constructor(driveItemName, events) {
        super({
            nodeName: "span",
            classList: [ driveFolderViewCssClasses.driveItemName ],
            textValue: driveItemName,
            events: events
        });
    }

    updateDriveItemName(driveItemName) {
        this.domNode.textContent = driveItemName;
    }
}

export class DriveItemCheckBox extends VDomEl {
    constructor(events) {
        super({
            nodeName: "input",
            attrs: {
                type: "checkbox"
            },
            events: events
        });
    }
}

export class DriveItemTextBox extends VDomEl {
    constructor(events) {
        super({
            nodeName: "input",
            attrs: {
                type: "text"
            },
            events: events
        });
    }
}

export class TableHeaderCell extends VDomEl {
    constructor(text, classList, childNodes) {
        super({
            nodeName: "th",
            classList: classList,
            childNodes: childNodes
        });

        this.attrs["scope"] = "col";

        if (trmrk.core.isNonEmptyString(text)) {
            this.childNodes.push(new VDomTextNode(text));
        }
    }
}

export class TableRowCell extends VDomEl {
    constructor(childNodes, classList) {
        super({
            nodeName: "td",
            classList: classList
        });

        this.childNodes = trmrk.core.objValOrDefault(childNodes, []);
    }
}

export class DriveItemsGridMainCell extends TableRowCell {
    driveItemNameVDomEl = null;

    constructor(
        mainCellShortPressListener,
        mainCellLongPressListener,
        driveItemName,
        mainCellMouseDown,
        mainCellMouseUp) {
        super([], [ driveFolderViewCssClasses.gridMainCell ]);

        let mainCellEvents = {};

        mainCellEvents[vdom.utils.shortLongMouseUpEventName] = [new EventOpts({
            listener: mainCellShortPressListener,
            altListener: mainCellLongPressListener,
            onMouseDown: mainCellMouseDown,
            onMouseUp: mainCellMouseUp
        })];

        this.driveItemNameVDomEl = new DriveItemNameVDomEl(
            driveItemName,
            mainCellEvents);

        this.childNodes.push(this.driveItemNameVDomEl);
    }

    updateDriveItemName(driveItemName) {
        this.driveItemNameVDomEl.updateDriveItemName(driveItemName);
    }
}

export class ErrorPopoverVDomEl extends VDomEl {
    constructor() {
        super({
            nodeName: "a",
            attrs: {
                href: trmrk.core.javascriptVoid,
                "data-bs-toggle": "popover",
                "data-bs-trigger": "focus"
            }
        });
    }
}

export class DriveItemsGridMainEditCell extends TableRowCell {
    textBoxVDomEl = null;
    errorPopoverVDomEl = null;
    bsPopover = null;

    constructor() {
        super([], [ driveFolderViewCssClasses.gridMainEditCell ]);

        this.textBoxVDomEl = new DriveItemTextBox({
            click: [{
                listener: e => this.hideError()
            }]
        });

        this.errorPopoverVDomEl = new ErrorPopoverVDomEl();
        this.childNodes = [ this.textBoxVDomEl, this.errorPopoverVDomEl ];
    }

    showError(error) {
        if (trmrk.core.isNonEmptyString(error, true)) {
            error = error.trim();
        } else {
            error = "An error occurred";
        }

        this.textBoxVDomEl.addClass(trmrkCssClasses.isInvalid);
        
        this.bsPopover = new bootstrap.Popover(
            this.errorPopoverVDomEl.domNode, {
                content: error,
                customClass: driveFolderViewCssClasses.errorPopover
            });

        this.bsPopover.show();
    }

    hideError() {
        this.textBoxVDomEl.removeClass(trmrkCssClasses.isInvalid);
        
        if (trmrk.core.isNotNullObj(this.bsPopover)) {
            this.bsPopover.dispose();
            this.bsPopover = null;
        }
    }
}

export class DriveItemsGridViewTrmrkEvents extends ViewModelBase {
    onNavigateToDriveItem = null;
    onUpdateDriveItemName = null;
    onDeleteItem = null;
    onEnterEditMode = null;
    onExitEditMode = null;

    constructor(src) {
        super();
        this.__copyProps(src);
    }
}