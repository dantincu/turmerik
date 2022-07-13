import { ValueWrapper } from '../common/core.js';
import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings, DriveItemOp, DriveItemNameMacro } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { DriveItemsGridViewTrmrkEvents, Validation } from './driveItemsGridView.core.js';
import { DriveItemsGridView } from './driveItemsGridView.js';
import { trmrkCssClasses, driveFolderViewCssClasses, driveFolderMacrosModalIds } from './cssClasses.js';
import { DriveExplorerHeader, DriveExplorerHeaderEvents } from './driveExplorerHeader.js';
import { getBsToggleBtn, EntryMacroDefVDomEl } from './driveExplorer.entryNameMacro.js';

export class DriveItemMacrosModalSectionCoreBase {
    headerVDomEl;
    bodyVDomEl;
}

export class DriveItemMacrosModalSectionBase extends DriveItemMacrosModalSectionCoreBase {
    toggleBtnVDomEl;
}

export class DriveItemMacroDefsModalSection extends DriveItemMacrosModalSectionBase {
}

export class DriveItemMacrosModalSection extends DriveItemMacrosModalSectionBase {
}

export class DriveItemMacrosModalSectionsGroup extends DriveItemMacrosModalSectionCoreBase {
    folders;
    files;
}

export class DriveItemMacrosModal {
    loadingVDomEl;
    loadingResponseStatusVDomEl;
    loadingResponseStatusTitleVDomEl;
    loadingResponseStatusTextVDomEl;
    modalVDomEl;
    macros;
    macroDefs;
    nameMacroDefs;
}

export class DriveExplorerMacros {
    driveItemNameMacros;
    driveItemMacros;

    currentDriveFolder;
    existingEntriesArr;

    modal;
    bsModal;
    onApplyMacroEventHandler;

    init() {
        this.modal = this.generateModal();
        this.bsModal = new bootstrap.Modal(this.modal.modalVDomEl.domNode)

        return this.modal.modalVDomEl;
    }

    generateModal() {
        const modal = this.generateModalLoadingSections();

        const modalBodyChildNodes = [
            modal.loadingVDomEl
        ];

        modal.modalVDomEl = this.generateModalVDomEl(
            driveFolderMacrosModalIds.modalId,
            "Create drive items with macros",
            modalBodyChildNodes
        );
        
        modal.modalVDomEl.createDomNode();
        return modal;
    }

    generateModalLoadingSections() {
        const modalSections = new DriveItemMacrosModal();

        modalSections.loadingResponseStatusVDomEl = vdom.utils.getVDomEl("h5", ["display-2", "fw-bold"]);
        modalSections.loadingResponseStatusTitleVDomEl = vdom.utils.getVDomEl("span", ["text-danger"]);

        modalSections.loadingResponseStatusTextVDomEl = vdom.utils.getVDomEl("p", ["fs-3"], {}, [
            modalSections.loadingResponseStatusTitleVDomEl
        ]);

        modalSections.loadingVDomEl = vdom.utils.getVDomEl("div",
            [ "text-center", trmrkCssClasses.loadingContainer ], {}, [
                modalSections.loadingResponseStatusVDomEl,
                modalSections.loadingResponseStatusTextVDomEl
        ]);

        return modalSections;
    }

    updateModal(apiResult, currentDriveFolder) {
        if (apiResult.isSuccess) {
            this.driveItemMacros = apiResult.data.macros;
            this.driveItemNameMacros = apiResult.data.nameMacros;
            this.currentDriveFolder = currentDriveFolder;

            const existingEntriesArr = currentDriveFolder.subFolders.concat(
                currentDriveFolder.folderFiles
            );

            this.existingEntriesArr = existingEntriesArr.map(
                item => item.name
            );

            this.modal.loadingContainer.addClass(trmrkCssClasses.hidden);
            this.generateModalSections();

            this.modal.appendChildVNode(modal.macros.headerVDomEl);
            this.modal.appendChildVNode(modal.macros.bodyVDomEl);

            this.modal.appendChildVNode(modal.macroDefs.headerVDomEl);
            this.modal.appendChildVNode(modal.macroDefs.bodyVDomEl);

            this.modal.appendChildVNode(modal.nameMacroDefs.headerVDomEl);
            this.modal.appendChildVNode(modal.nameMacroDefs.bodyVDomEl);
        } else {
            let status = trmrk.core.toNonEmptyStringOrDefault(apiResult.status, "Error");
            let statusText = trmrk.core.toNonEmptyStringOrDefault(apiResult.statusText, "An error has ocurred");

            this.modal.loadingResponseStatusVDomEl.appendChildVNode(new VDomTextNode(status));
            this.modal.loadingResponseStatusTitleVDomEl.setTextValue("Oops! ");
            this.modal.loadingResponseStatusTextVDomEl.appendChildVNode(new VDomTextNode(statusText));
        }
    }

    generateModalSections() {
        const modalSections = this.modal;
        const idxValueWrapper = new ValueWrapper();

        idxValueWrapper.value = 0;
        modalSections.macros = this.generateMacrosContainerSectionsGroup();

        modalSections.macroDefs = this.generateMacroDefsContainerSection(idxValueWrapper);
        modalSections.nameMacroDefs = this.generateNameMacroDefsContainerSection(idxValueWrapper);

        return modalSections;
    }

    generateModalBodySection(
        sectionTitle,
        sectionId,
        section,
        sectionNodesArr = null,
        hasToggleButton = false
    ) {
        const headerChildNodes = [ new VDomTextNode(sectionTitle) ];

        if (hasToggleButton) {
            section.toggleBtnVDomEl = getBsToggleBtn(
                "#" + sectionId,
                "Toggle", "btn-primary");

            headerChildNodes.splice(0, 0, section.toggleBtnVDomEl);
        }

        section.headerVDomEl = vdom.utils.getVDomEl("h6",
            [ trmrkCssClasses.section, trmrkCssClasses.header ],
                {}, headerChildNodes);

        const bodyVDomElClassList = [
            trmrkCssClasses.section,
            trmrkCssClasses.body
        ];

        if (hasToggleButton) {
            bodyVDomElClassList.splice(
                Infinity, 0, "collapse", "show" );
        }
        
        section.bodyVDomEl = vdom.utils.getVDomEl("ul",
            bodyVDomElClassList, { id: sectionId },
            sectionNodesArr);

        return section;
    }

    generateMacrosContainerSectionsGroup() {
        const sectionsGroup = new DriveItemMacrosModalSectionsGroup();

        sectionsGroup.folders = this.generateModalBodySection(
            "Folders", driveFolderMacrosModalIds.foldersSectionId,
            new DriveItemMacrosModalSection());

        sectionsGroup.files = this.generateModalBodySection(
            "Files", driveFolderMacrosModalIds.filesSectionId,
            new DriveItemMacrosModalSection());

        sectionsGroup.headerVDomEl = vdom.utils.getVDomEl("h5",
            [ trmrkCssClasses.header ], {}, [
                getBsToggleBtn(
                    "#" + driveFolderMacrosModalIds.macrosSectionsGroup,
                    "Toggle", "btn-primary"),
                new VDomTextNode("Add drive items")
            ]);

        sectionsGroup.bodyVDomEl = vdom.utils.getVDomEl("div",
            [ trmrkCssClasses.sectionsGroup, "collapse", "show" ],
            { id: driveFolderMacrosModalIds.macrosSectionsGroup }, [
                sectionsGroup.folders.headerVDomEl,
                sectionsGroup.folders.bodyVDomEl,
                sectionsGroup.files.headerVDomEl,
                sectionsGroup.files.bodyVDomEl,
            ]);

        return sectionsGroup;
    }

    generateMacroDefsContainerSection(idxValueWrapper) {
        const section = this.generateMacroDefsContainerSectionCore(
            this.driveItemMacros, idxValueWrapper,
            catKey => this.getDriveItemOp(null, this.driveItemMacros[catKey].item2),
            "Macros", driveFolderMacrosModalIds.macroDefsSection
        );

        return section;
    }

    generateNameMacroDefsContainerSection(idxValueWrapper) {
        const section = this.generateMacroDefsContainerSectionCore(
            this.driveItemMacros, idxValueWrapper,
            catKey => this.getDriveItemOp(null,
                this.driveItemNameMacros[catKey].item2.map(
                    macro => this.getDriveItemOp(macro))),
            "Name macros", driveFolderMacrosModalIds.nameMacroDefsSection
        );

        return section;
    }

    generateMacroDefsContainerSectionCore(
        driveItemMacros,
        idxValueWrapper,
        driveItemOpFactory,
        sectionTitle,
        sectionId) {
        
        const sectionNodes = Object.keys(driveItemMacros).map(
            catKey => new EntryMacroDefVDomEl(
                this.existingEntriesArr,
                driveItemOpFactory(catKey),
                idxValueWrapper,
                this.onApplyMacroEventHandler,
                this.driveItemMacros[catKey].item1));

        const section = this.generateModalBodySection(
            sectionTitle, sectionId,
            new DriveItemMacroDefsModalSection(),
            sectionNodes, true);

        return section;
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
                                vdom.utils.getVDomEl("h4", [ "modal-title" ], {}, [], {}, modalTitle),
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

    getDriveItemOp(nameMacro, multipleItems) {
        const driveItemOp = new DriveItemOp();
        driveItemOp.nameMacro = nameMacro;

        driveItemOp.multipleItems = multipleItems;
        return driveItemOp;
    }

    getApplyMacroEventHandler() {
        const that = this;

        const onApplyMacroEventHandler = function(driveItemOp) {
            
        };

        return onApplyMacroEventHandler;
    }
}