import { VDomEl} from '../common/vdom.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { TableHeaderCell, DriveItemCheckBox } from './driveItemsGridView.core.js';

export class DriveItemsGridHeaderRow extends VDomEl {
    checkBox;
    isChecked = false;

    constructor(headerCheckBoxElEvents) {
        super({
            nodeName: "tr"
        });

        this.checkBox = new DriveItemCheckBox(headerCheckBoxElEvents);

        this.childNodes = [
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridCheckBoxCell ], [ this.checkBox ] ),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell("Name", [ driveFolderViewCssClasses.gridMainCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ]),
            new TableHeaderCell(null, [ driveFolderViewCssClasses.gridIconCell ])
        ];
    }

    check() {
        this.isChecked = true;
        this.checkBox.domNode.checked = true;

        this.checkBox.addAttr("checked", true);
        this.addClass(trmrkCssClasses.checked);
    }

    uncheck() {
        this.isChecked = false;
        this.checkBox.domNode.checked = false;

        this.checkBox.removeAttr("checked");
        this.removeClass(trmrkCssClasses.checked);
    }
}
