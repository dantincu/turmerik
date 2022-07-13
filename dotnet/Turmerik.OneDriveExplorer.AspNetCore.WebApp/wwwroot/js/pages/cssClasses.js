import { trmrkCssClasses as trmrkCssClassesInstn } from '../common/domUtils.js';

export class DriveFolderViewCssClasses {
    driveFolder = "trmrk-drive-folder";
    driveFile = "trmrk-drive-file";
    driveFolderView = "trmrk-drive-folder-view";
    driveItemName = "trmrk-drive-item-name";
    driveFolderViewHeader = "trmrk-drive-folder-view-header";
    driveFolderViewStickyHeader = "trmrk-drive-folder-view-sticky-header";
    gridMainCell = "trmrk-grid-main-cell";
    gridMainEditCell = "trmrk-grid-main-edit-cell";
    gridIconCell = "trmrk-grid-icon-cell";
    gridCheckBoxCell = "trmrk-grid-checkbox-cell";
    gridHeaderCheckBox = "trmrk-grid-header-checkbox";
    itemsGrid = "trmrk-drive-items-grid";
    foldersGrid = "trmrk-drive-folders-grid";
    filesGrid = "trmrk-drive-files-grid";
    errorPopover = "trmrk-error-popover";
    entryMacrosContainer = "trmrk-entry-macros-container";
    entryMacroDefsContainer = "trmrk-entry-macro-defs-container";
    entryNameMacroDefsContainer = "trmrk-entry-name-macro-defs-container";
}

export class DriveFolderMacrosModalIds {
    modalId = "driveItemMacrosModal";
    macrosSectionsGroup = "driveItemMacrosSectionsGroup";
    foldersSectionId = "driveItemMacrosFoldersSection";
    filesSectionId = "driveItemMacrosFilesSection";
    macroDefsSection = "driveItemMacroDefsSection";
    nameMacroDefsSection = "driveItemNameMacroDefsSection";
}

export class DriveFolderMacrosCssClasses {
    macroContainer = "trmrk-drive-item-macro-container";
    nameMacroContainer = "trmrk-drive-item-name-macro-container";
    nameMacroPartContainer = "trmrk-drive-item-name-macro-part-container";
    nameMacroPartPopoverContainer = "trmrk-drive-item-name-macro-part-popover-container";
}

export const trmrkCssClasses = trmrkCssClassesInstn;
export const driveFolderViewCssClasses = new DriveFolderViewCssClasses();
export const driveFolderMacrosModalIds = new DriveFolderMacrosModalIds();
export const driveFolderMacrosCssClasses = new DriveFolderMacrosCssClasses();
