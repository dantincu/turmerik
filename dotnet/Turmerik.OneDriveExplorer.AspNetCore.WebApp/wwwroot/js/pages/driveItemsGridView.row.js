import { VDomEl } from '../common/vdom.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { IconVDomEl, DriveItemCheckBox, TableRowCell, DriveItemsGridMainCell } from './driveItemsGridView.core.js';

export class DriveItemsGridRow extends VDomEl {
    driveItem;
    mainCell = null;
    isChecked = false;
    isDisabled = false;
    rowCheckedHandler = null;
    checkBox = null;

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

        this.checkBox = new DriveItemCheckBox({
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

                    setTimeout(() => {
                        if (retVal) {
                            if (that.isChecked) {
                                that.uncheckRow();
                            } else {
                                that.checkRow();
                            }

                            that.rowCheckedHandler(that, that.isChecked);
                        }
                    }, 0);

                    e.preventDefault();
                    e.stopPropagation();
                }
            }]
        }, false);

        this.childNodes = [
            new TableRowCell([
                this.checkBox
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

    updateDriveItem(driveItem) {
        this.mainCell.updateDriveItemName(driveItem.name);
        copyProps(this.driveItem, driveItem, false, true);
    }

    checkRow() {
        this.isChecked = true;
        this.checkBox.domNode.checked = true;

        this.checkBox.addAttr("checked", true);
        this.addClass(trmrkCssClasses.checked);
    }

    uncheckRow() {
        this.isChecked = false;
        this.checkBox.domNode.checked = false;

        this.checkBox.removeAttr("checked");
        this.removeClass(trmrkCssClasses.checked);
    }
}
