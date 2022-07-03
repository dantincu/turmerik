import { domUtils } from '../common/domUtils.js';
import { trmrk } from '../common/main.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItem } from './Entities.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { IconVDomEl, DriveItemCheckBox, TableRowCell, DriveItemsGridMainCell } from './driveItemsGridView.core.js';

export class DriveItemsGridRow extends VDomEl {
    driveItem;
    mainCell = null;
    isChecked = false;
    isDisabled = false;
    rowCheckedHandler = null;

    constructor(
        driveItem,
        mainCellShortPressListener,
        mainCellLongPressListener,
        isFoldersGrid,
        rowCheckedHandler) {
        super({
            nodeName: "tr"
        });

        this.driveItem = driveItem;
        this.rowCheckedHandler = rowCheckedHandler;
        
        mainCellShortPressListener = mainCellShortPressListener.bind(this);
        mainCellLongPressListener = mainCellLongPressListener.bind(this);

        this.runMouseEvent = this.runMouseEvent.bind(this);
        const that = this;

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

                                if (checked) {
                                    that.checkRow();
                                } else {
                                    that.uncheckRow();
                                }

                                that.rowCheckedHandler(that, checked);
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

    checkRow() {
        that.isChecked = true;
        that.addClass(trmrkCssClasses.checked);
    }

    uncheckRow() {
        that.isChecked = false;
        that.removeClass(trmrkCssClasses.checked);
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

    updateDriveItem(driveItem) {
        this.mainCell.updateDriveItemName(driveItem.name);
        this.driveItem = driveItem;
    }
}
