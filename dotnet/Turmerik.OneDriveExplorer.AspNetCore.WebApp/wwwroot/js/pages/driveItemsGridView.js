import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';
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
            classList: [ driveFolderViewCssClasses.name ],
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
    constructor(text, classList) {
        super({
            nodeName: "th",
            classList: classList
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

export class DriveItemsGridHeaderRow extends VDomEl {
    constructor() {
        super({
            nodeName: "tr"
        });

        this.childNodes = [
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridCheckBoxCell ] ),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell("Name", [ driveFolderViewCssClasses.gridMainCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }
}

export class DriveItemsGridRow extends VDomEl {
    driveItem;
    mainCell = null;
    isChecked = false;
    isDisabled = false;

    constructor(
        driveItem,
        mainCellShortPressListener,
        mainCellLongPressListener,
        isFoldersGrid) {
        super({
            nodeName: "tr"
        });

        this.driveItem = driveItem;
        const that = this;

        mainCellShortPressListener = mainCellShortPressListener.bind(this);
        mainCellLongPressListener = mainCellLongPressListener.bind(this);

        this.runMouseEvent = this.runMouseEvent.bind(this);

        this.mainCell = new DriveItemsGridMainCell(
            mainCellShortPressListener,
            mainCellLongPressListener,
            driveItem.name,
            this.getDefaultMouseDownListener(),
            this.getDefaultMouseUpListener());

        this.childNodes = [
            new TableRowCell([
                new DriveItemCheckBox({
                    click: [{
                        listener: function(e) {
                            const retVal = that.canRunMouseEvent(e);

                            if (!retVal) {
                                e.preventDefault();
                                e.stopPropagation();
                            }

                            return retVal;
                        }
                    }],
                    mousedown: [{
                        listener: function(e) {
                            that.addPressedClass(e);
                        }
                    }],
                    mouseup: [{
                        listener: function(e) {
                            const retVal = that.removePressedClass(e);

                            if (retVal) {
                                let checked = !this.domNode.checked; // at this point the checked property has not yet been updated
                                that.isChecked = checked;

                                if (checked) {
                                    that.addClass(trmrkCssClasses.checked);
                                } else {
                                    that.removeClass(trmrkCssClasses.checked);
                                }
                            } else {
                                e.preventDefault();
                                e.stopPropagation();
                            }

                            return retVal;
                        }
                    }]
                })
            ], [ driveFolderViewCssClasses.gridCheckBoxCell ]),
            new TableRowCell([
                new IconVDomEl([ "oi", isFoldersGrid ? "oi-folder" : "oi-file" ],
                this.getDefaultMouseEvents())
            ], [ driveFolderViewCssClasses.gridIconCell ]),
            this.mainCell,
            new TableRowCell([
                new IconVDomEl(
                    [ "oi", "oi-pencil" ],
                    {
                        mouseup: [{
                            listener: function(e) {
                                that.removePressedClass(e);
                                mainCellLongPressListener.call(that, e);
                            }
                        }],
                        mousedown: [ this.getDefaultMouseDownEvent() ]
                    })
            ], [ driveFolderViewCssClasses.gridIconCell ]),
            new TableRowCell([
                new IconVDomEl(
                    [ "oi", "oi-ellipses", trmrkCssClasses.rotate90Deg ],
                    this.getDefaultMouseEvents())
            ], [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }

    canRunMouseEvent(e) {
        const canRun = !this.isDisabled && e.button === 0;
        return canRun;
    }

    runMouseEvent(e, callback) {
        const retVal = this.canRunMouseEvent(e);

        if (retVal) {
            callback.call(this, e);
        }

        return retVal;
    }

    addPressedClass(e) {
        const retVal = this.runMouseEvent(e,
            () => this.addClass(trmrkCssClasses.pressed));

        return retVal;
    }

    removePressedClass(e) {
        const retVal = this.runMouseEvent(e,
            () => this.removeClass(trmrkCssClasses.pressed));

        return retVal;
    }

    getDefaultMouseUpListener() {
        const listener = e => this.removePressedClass(e);
        return listener;
    }

    getDefaultMouseDownListener() {
        const listener = e => this.addPressedClass(e);
        return listener;
    }

    getDefaultMouseUpEvent() {
        const event = {
            listener: this.getDefaultMouseUpListener()
        };

        return event;
    }

    getDefaultMouseDownEvent() {
        const event = {
            listener: this.getDefaultMouseDownListener()
        };

        return event;
    }

    getDefaultMouseEvents() {
        const events = {
            mouseup: [ this.getDefaultMouseUpEvent() ],
            mousedown: [ this.getDefaultMouseDownEvent() ]
        };

        return events;
    }

    updateDriveItemName(driveItemName) {
        this.mainCell.updateDriveItemName(driveItemName);
    }
}

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

export class DriveItemsGridView extends VDomEl {
    driveItemsArr = [];
    isFoldersGrid = false;
    tableBodyVDomEl = null;
    editRow = null;
    editRowTextBoxVDomEl = null;
    currentRow = null;
    currentDriveItem = null;
    isEditMode = false;
    trmrkEvents = null;
    editRowValidator = null;

    constructor(driveItemsArr, isFoldersGrid, trmrkEvents, editRowValidator) {
        super({
            nodeName: "div"
        });

        this.driveItemsArr = trmrk.core.objValOrDefault(driveItemsArr, []);
        this.isFoldersGrid = isFoldersGrid;

        this.trmrkEvents = trmrkEvents;
        const driveItemsGridCssClass = this.getDriveItemsGridCssClass(isFoldersGrid);

        this.classList = [
            driveFolderViewCssClasses.itemsGrid,
            driveItemsGridCssClass
        ];

        this.editRow = this.getEditRow();
        this.editRowTextBoxVDomEl = this.editRow.mainEditCell.textBoxVDomEl;

        const tableVDomEl = this.getTableVDomEl();
        this.childNodes = [ tableVDomEl ];

        this.editRowValidator = editRowValidator;
    }

    getDriveItemsGridCssClass(isFoldersGrid) {
        let driveItemsGridCssClass = "";

        if (isFoldersGrid) {
            driveItemsGridCssClass = driveFolderViewCssClasses.foldersGrid;
        } else {
            driveItemsGridCssClass = driveFolderViewCssClasses.filesGrid;
        }

        return driveItemsGridCssClass;
    }

    getEditRow() {
        const that = this;

        const editRow = new DriveItemsGridEditRow(
            function(e) {
                if (!this.isReadonly && e.button === 0) {
                    that.endEditTableRow();
                }
            }, function(e) {
                if (!this.isReadonly && e.button === 0) {
                    const textValue = that.editRowTextBoxVDomEl.domNode.value;
                    const validation = that.editRowValidator(textValue);

                    if (validation.isValid) {
                        editRow.setReadonly();

                        trmrk.core.applyIfOfTypeFunc(
                            that.trmrkEvents.onUpdateDriveItemName, that,
                            [ that.currentDriveItem, textValue ]);
                    } else {
                        editRow.showError(validation.error);
                    }
                }
            }, function(e) {
                if (!this.isReadonly && e.button === 0 && trmrk.core.isNotNullObj(that.currentDriveItem)) {
                    editRow.setReadonly();

                    trmrk.core.applyIfOfTypeFunc(
                        that.trmrkEvents.onDeleteItem, that,
                        [ that.currentDriveItem ]);
                }
            }
        );

        editRow.createDomNode();
        return editRow;
    }

    getTableVDomEl() {
        const tableHeaderVDomEl = this.getTableHeaderVDomEl();
        const tableBodyVDomEl = this.getTableBodyVDomEl();

        const tableVDomEl = vdom.utils.getVDomEl("table", [ "table" ], {}, [
            tableHeaderVDomEl, tableBodyVDomEl
        ]);

        return tableVDomEl;
    }

    getTableHeaderVDomEl() {
        const tableHeaderVDomEl = vdom.utils.getVDomEl("thead", [], {}, [
            new DriveItemsGridHeaderRow()]);

        return tableHeaderVDomEl;
    }

    getTableBodyVDomEl() {
        const tableRowsArr = this.driveItemsArr.map(item => this.getTableRow(item));
        const tableBodyVDomEl = vdom.utils.getVDomEl("tbody", [], {}, tableRowsArr);

        this.tableBodyVDomEl = tableBodyVDomEl;
        return tableBodyVDomEl;
    }

    getTableRow(driveItem) {
        const that = this;

        const tableRowVDomEl = new DriveItemsGridRow(
            driveItem,
            function(e) {
                if (!that.isEditMode && e.button === 0) {
                    that.onNavigateToDriveItem(driveItem);
                }
            }, function(e) {
                if (!that.isEditMode && e.button === 0) {
                    that.startEditTableRow(this, driveItem);
                }
            },
            this.isFoldersGrid);

        return tableRowVDomEl;
    }

    startEditTableRow(tableRow, driveItem) {
        if (!this.isEditMode) {
            this.enterEditMode();
            const editRow = this.editRow;

            const tableBodyVDomEl = this.tableBodyVDomEl;

            if (trmrk.core.isNotNullObj(tableRow)) {
                tableRow.removeClass(trmrkCssClasses.pressed);
                this.currentRow = tableRow;

                tableBodyVDomEl.domNode.replaceChild(editRow.domNode, tableRow.domNode);
                this.currentDriveItem = driveItem;

                const textValue = driveItem.name;
                this.editRowTextBoxVDomEl.domNode.value = textValue;
            } else {
                tableBodyVDomEl.domNode.appendChild(editRow.domNode);    
                this.currentDriveItem = null;
                this.currentRow = null;
            }
            
            this.editRowTextBoxVDomEl.domNode.focus();
            this.editRowTextBoxVDomEl.domNode.select();
        }
    }

    endEditTableRow() {
        this.editRow.clearError();
        this.editRowTextBoxVDomEl.domNode.value = "";
        this.currentDriveItem = null;

        if (trmrk.core.isNotNullObj(this.currentRow)) {
            this.tableBodyVDomEl.domNode.replaceChild(this.currentRow.domNode, this.editRow.domNode);
            this.currentRow = null;
        } else {
            this.tableBodyVDomEl.domNode.removeChild(this.editRow.domNode);
        }

        this.exitEditMode();
        this.editRow.isReadonly = false;
    }

    enterEditMode(triggered) {
        if (!triggered) {
            this.isEditMode = true;
            this.onEnterEditMode();
        } else {
            for (let row of this.tableBodyVDomEl.childNodes) {
                row.isDisabled = true;
            }
        }
    }

    exitEditMode(triggered) {
        if (!triggered) {
            this.isEditMode = false;
            this.onExitEditMode();
        } else {
            for (let row of this.tableBodyVDomEl.childNodes) {
                row.isDisabled = false;
            }
        }
    }

    onEnterEditMode() {
        if (trmrk.core.isOfTypeFunction(this.trmrkEvents.onEnterEditMode)) {
            this.trmrkEvents.onEnterEditMode();
        }
    }

    onExitEditMode() {
        if (trmrk.core.isOfTypeFunction(this.trmrkEvents.onExitEditMode)) {
            this.trmrkEvents.onExitEditMode();
        }
    }

    onNavigateToDriveItem(driveItem) {
        if (trmrk.core.isOfTypeFunction(this.trmrkEvents.onNavigateToDriveItem)) {
            this.trmrkEvents.onNavigateToDriveItem(driveItem);
        }
    }

    addTableRow(newDriveItem) {
        const tableRow = this.getTableRow(newDriveItem);
        this.tableBodyVDomEl.appendChildVNode(tableRow);
    }
}
