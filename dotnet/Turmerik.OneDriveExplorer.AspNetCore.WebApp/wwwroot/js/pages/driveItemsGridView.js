import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { DriveItemsGridHeaderRow } from './driveItemsGridView.headerRow.js';
import { DriveItemsGridRow } from './driveItemsGridView.row.js';
import { DriveItemsGridEditRow } from './driveItemsGridView.editRow.js';

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
    tableHeaderVDomEl = null;
    tableHeaderRowVDomEl = null;
    tableBodyVDomEl = null;

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
        this.tableHeaderVDomEl = this.getTableHeaderVDomEl();
        this.tableBodyVDomEl = this.getTableBodyVDomEl();

        const tableVDomEl = vdom.utils.getVDomEl("table", [ "table" ], {}, [
            this.tableHeaderVDomEl, this.tableBodyVDomEl
        ]);

        return tableVDomEl;
    }

    getTableHeaderVDomEl() {
        const that = this;

        const headerCheckBoxElEvents = {
            click: [{
                listener: e => {
                    const isChecked = that.tableHeaderRowVDomEl.isChecked;

                    setTimeout(() => {
                        for (let row of that.tableBodyVDomEl.childNodes) {
                            if (isChecked) {
                                if (row.isChecked) {
                                    row.uncheckRow();
                                }
                            } else {
                                if (!row.isChecked) {
                                    row.checkRow();
                                }
                            }
                        }

                        if (isChecked) {
                            that.tableHeaderRowVDomEl.uncheck();
                        } else {
                            that.tableHeaderRowVDomEl.check();
                        }
                    }, 0);
                }
            }]
        }

        this.tableHeaderRowVDomEl = new DriveItemsGridHeaderRow(headerCheckBoxElEvents);

        const tableHeaderVDomEl = vdom.utils.getVDomEl(
            "thead", [], {}, [ this.tableHeaderRowVDomEl ]);

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
            this.isFoldersGrid,
            (row, checked) => {
                if (checked) {
                    if (!that.tableBodyVDomEl.childNodes.find(
                        node => !node.isChecked
                    )) {
                        that.tableHeaderRowVDomEl.check();
                    }
                } else {
                    if (that.tableHeaderRowVDomEl.isChecked === true) {
                        that.tableHeaderRowVDomEl.uncheck();
                    }
                }
            });

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
            this.trmrkEvents.onEnterEditMode(this.currentDriveItem);
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
