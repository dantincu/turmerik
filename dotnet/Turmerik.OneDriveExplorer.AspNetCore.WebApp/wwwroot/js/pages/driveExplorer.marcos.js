import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings, DriveItemOp, DriveItemNameMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.core.js';
import { DriveItemsGridView } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';

export class DriveExplorerMacros {
    driveItemNameMacros;
    driveItemMacros;

    driveItemNameMacrosModalVDomEl;
    driveItemMacrosModalVDomEl;

    init(driveItemNameMacros,
        driveItemMacros) {
        this.driveItemNameMacros = driveItemNameMacros;
        this.driveItemMacros = driveItemMacros;

        this.generateModalVDomElms();
        return [ this.driveItemNameMacrosModalVDomEl, this.driveItemMacrosModalVDomEl ];
    }

    generateModalVDomElms() {
        this.driveItemNameMacrosModalVDomEl = this.generateDriveItemNameMacrosModalVDomEl();
        this.driveItemMacrosModalVDomEl = this.generateDriveItemMacrosModalVDomEl();
    }

    generateDriveItemNameMacrosModalVDomEl() {
        const bodyNodes = this.generateDriveItemNameMacrosModalBodyNodes();

        const modalVDomEl = this.generateModalVDomEl("driveItemNameMacrosModal",
            "Drive Item Name Macros", bodyNodes
        );

        return modalVDomEl;
    }

    generateDriveItemMacrosModalVDomEl() {
        const bodyNodes = this.generateDriveItemMacrosModalBodyNodes();

        const modalVDomEl = this.generateModalVDomEl("driveItemMacrosModal",
            "Drive Item Macros", bodyNodes
        );

        return modalVDomEl;
    }

    generateDriveItemNameMacrosModalBodyNodes() {
        const nodes = [];

        return nodes;
    }

    generateDriveItemMacrosModalBodyNodes() {
        const nodes = [];

        return nodes;
    }

    generateModalVDomEl(
        modalId,
        modalTitle,
        modalBodyChildNodes) {
        const modalVDomEl = vdom.utils.getVDomEl(
            "div", [ "modal" ], { id: modalId },
            [
                vdom.utils.getVDomEl("div",
                    [ "modal-dialog", "modal-dialog-scrollable", "modal-xl" ], {}, [
                        vdom.utils.getVDomEl("div", [ "modal-content" ], {}, [
                            vdom.utils.getVDomEl("div", [ "modal-header" ], {}, [
                                vdom.utils.getVDomEl("h5", [ "modal-title" ], {}, [], {}, modalTitle),
                                vdom.utils.getVDomEl("button", [ "btn-close" ],
                                    { type: "button", "data-bs-dismiss": "modal" })
                            ]),
                            vdom.utils.getVDomEl("div", [ "modal-body" ], {}, modalBodyChildNodes),
                            vdom.utils.getVDomEl("div", [ "modal-footer" ], {}, [
                                vdom.utils.getVDomEl("button", [ "btn", "btn-secondary" ],
                                    { type: "button", "data-bs-dismiss": "modal" }, [], {}, "Close")
                            ])
                        ])
                    ])
            ]);

        return modalVDomEl;
    }
}