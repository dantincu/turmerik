import { EntityBase } from '../common/core.js';
import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';

export class TrmrkCssClasses {
    rotate45Deg = "trmrk-rotate-45deg";
    rotate90Deg = "trmrk-rotate-90deg";
    timesIcon = "trmrk-times-icon";
    plusIcon = "trmrk-plus-icon";
    icon = "trmrk-icon";
    editMode = "trmrk-edit-mode";
    checked = "trmrk-checked";
    pressed = "trmrk-pressed";
    iconsRow = "trmrk-icons-row";
    isInvalid = "trmrk-is-invalid";
}

export class DriveFolderViewCssClasses {
    view = "trmrk-drive-folder-view";
    name = "trmrk-drive-item-name";
    header = "trmrk-drive-folder-view-header";
    stickyHeader = "trmrk-drive-folder-view-sticky-header";
    gridMainCell = "trmrk-grid-main-cell";
    gridMainEditCell = "trmrk-grid-main-edit-cell";
    gridIconCell = "trmrk-grid-icon-cell"
    gridCheckBoxCell = "trmrk-grid-checkbox-cell"
    itemsGrid = "trmrk-drive-items-grid";
    foldersGrid = "trmrk-drive-folders-grid";
    filesGrid = "trmrk-drive-files-grid";
}

export const trmrkCssClasses = new TrmrkCssClasses();
export const driveFolderViewCssClasses = new DriveFolderViewCssClasses();

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

        this.childNodes.push(
            new DriveItemNameVDomEl(
                driveItemName,
                mainCellEvents));
    }
}

export class DriveItemsGridMainEditCell extends TableRowCell {
    textBoxVDomEl = null;

    constructor() {
        super([], [ driveFolderViewCssClasses.gridMainEditCell ]);

        this.textBoxVDomEl = new DriveItemTextBox();
        this.childNodes = [this.textBoxVDomEl];
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
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }
}

export class DriveItemsGridRow extends VDomEl {
    driveItem;
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
            new DriveItemsGridMainCell(
                mainCellShortPressListener,
                mainCellLongPressListener,
                driveItem.name,
                this.getDefaultMouseDownListener(),
                this.getDefaultMouseUpListener()),
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
}

export class DriveItemsGridEditRow extends VDomEl {
    mainEditCell = null;

    constructor(
        editCancelListener,
        editConfirmListener) {
        super({
            nodeName: "tr"
        });

        this.mainEditCell = new DriveItemsGridMainEditCell();
        this.mainEditCell.parentVDomEl = this;

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
                                if (e.button === 0) {
                                    this.mainEditCell.textBoxVDomEl.domNode.value = "";
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
                [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }
}

export class DriveItemsGridViewTrmrkEvents extends EntityBase {
    onNavigateToDriveItem = null;
    onUpdateDriveItemName = null;
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

    constructor(driveItemsArr, isFoldersGrid, trmrkEvents) {
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
                if (e.button === 0) {
                    that.endEditTableRow(that.currentRow, true);
                }
            }, function(e) {
                if (e.button === 0) {
                    const currentDriveItem = that.currentDriveItem;
                    const textValue = that.endEditTableRow(that.currentRow);

                    if (trmrk.core.isNonEmptyString(textValue, true)) {
                        trmrk.core.applyIfOfTypeFunc(
                            that.trmrkEvents.onUpdateDriveItemName, that,
                            [currentDriveItem, textValue]);
                    }
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
            }
            
            this.editRowTextBoxVDomEl.domNode.focus();
            this.editRowTextBoxVDomEl.domNode.select();
        }
    }

    endEditTableRow(tableRow, isCancel) {
        const tableBodyVDomEl = this.tableBodyVDomEl;
        const editRow = this.editRow;
        
        const textValue = this.editRowTextBoxVDomEl.domNode.value;

        if (isCancel || trmrk.core.isNonEmptyString(textValue, true)) {
            this.editRowTextBoxVDomEl.removeClass(trmrkCssClasses.isInvalid);
            this.editRowTextBoxVDomEl.domNode.value = "";

            if (trmrk.core.isNotNullObj(tableRow)) {
                tableBodyVDomEl.domNode.replaceChild(tableRow.domNode, editRow.domNode);
            } else {
                tableBodyVDomEl.domNode.removeChild(editRow.domNode);
            }

            this.currentDriveItem = null;
            this.currentRow = null;

            this.exitEditMode();
        } else {
            this.editRowTextBoxVDomEl.addClass(trmrkCssClasses.isInvalid);
        }

        return textValue;
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
}
