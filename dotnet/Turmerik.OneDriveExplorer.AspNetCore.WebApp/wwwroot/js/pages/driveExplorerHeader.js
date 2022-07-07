import { trmrk, webStorage, domUtils, bsDomUtils } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';
import { TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { vdom, VDomEl, EventOpts, VDomTextNode } from '../common/vdom.js';
import { trmrkCssClasses, driveFolderViewCssClasses } from './cssClasses.js';

export class DriveExplorerHeaderEvents extends ViewModelBase {
    constructor(src) {
        super();
        this.__copyProps(src);
    }

    onCurrentDriveFolderHomeClick = null;
    onCurrentDriveFolderReloadClick = null;
    onCurrentDriveFolderGoUpClick = null;
    onCurrentDriveFolderMainCommandsClick = null;
    onCurrentDriveFolderOptionsClick = null;
    
    onExpandCurrentDriveFolderTitle = null;
    onCollapseCurrentDriveFolderTitle = null;
    
    onCurrentDriveFolderCreateNewFolderClick = null;
    onCurrentDriveFolderCreateNewTextFileClick = null;
    onCurrentDriveFolderCreateWithMacrosClick = null;
    onCurrentDriveFolderCommandsClick = null;
    onCurrentDriveFolderOpenInNewTabClick = null;
}

export class DriveExplorerHeader extends VDomEl {
    titleVDomEl = null;
    titleExpandButton = null;
    titleCollapseButton = null;

    constructor(driveFolder, isSticky, eventListeners) {
        super({
            nodeName: "div",
            classList: [ isSticky ? driveFolderViewCssClasses.driveFolderViewStickyHeader : driveFolderViewCssClasses.driveFolderViewHeader ]
        });

        const events = new DriveExplorerHeaderEvents(eventListeners);

        this.titleExpandButton = vdom.utils.getVDomEl("span", [ "oi", "oi-caret-right", trmrkCssClasses.icon ], {}, [], 
            this.getMouseClickEvent(events.onExpandCurrentDriveFolderTitle));

        this.titleCollapseButton = vdom.utils.getVDomEl("span", [ "oi", "oi-caret-bottom", trmrkCssClasses.icon, trmrkCssClasses.hidden ], {}, [], 
            this.getMouseClickEvent(events.onCollapseCurrentDriveFolderTitle));

        this.titleVDomEl = vdom.utils.getVDomEl("h6", [ trmrkCssClasses.collapsed ], {}, [
            this.titleExpandButton,
            this.titleCollapseButton,
            new VDomTextNode(driveFolder.name)
        ]);

        this.childNodes = [
            vdom.utils.getVDomEl("div", [ trmrkCssClasses.iconsRow ], {}, [
                vdom.utils.getVDomEl("span", [ "oi", "oi-home", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderHomeClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-reload", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderReloadClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-arrow-circle-top", trmrkCssClasses.icon ], {}, [],
                    this.getMouseClickEvent(events.onCurrentDriveFolderGoUpClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-command", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderMainCommandsClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-ellipses", "trmrk-rotate-90deg", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderOptionsClick))
            ]),
            this.titleVDomEl,
            vdom.utils.getVDomEl("div", [ trmrkCssClasses.iconsRow ], {}, [
                vdom.utils.getVDomEl("span", [ "oi", "oi-folder", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderCreateNewFolderClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-file", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderCreateNewTextFileClick)),
                vdom.utils.getVDomEl("span", [ trmrkCssClasses.plusIcon, trmrkCssClasses.icon ], {}, "+", 
                    this.getMouseClickEvent(events.onCurrentDriveFolderCreateWithMacrosClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-command", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderCommandsClick)),
                vdom.utils.getVDomEl("span", [ "oi", "oi-arrow-thick-top", "trmrk-rotate-45deg", trmrkCssClasses.icon ], {}, [], 
                    this.getMouseClickEvent(events.onCurrentDriveFolderOpenInNewTabClick)),
            ])
        ];
    }

    getMouseClickEvent(callback) {
        const that = this;

        const event = {
            click: [{
                listener: function(e) {
                    if (e.button === 0 && !that.isEditMode) {
                        callback.call(that, e);
                    }
                }
            }]
        };

        return event;
    }

    expandTitle() {
        this.titleVDomEl.removeClass(trmrkCssClasses.collapsed);
        this.titleVDomEl.addClass(trmrkCssClasses.expanded);
        this.titleExpandButton.addClass(trmrkCssClasses.hidden);
        this.titleCollapseButton.removeClass(trmrkCssClasses.hidden);
    }

    collapseTitle() {
        this.titleVDomEl.removeClass(trmrkCssClasses.expanded);
        this.titleVDomEl.addClass(trmrkCssClasses.collapsed);
        this.titleCollapseButton.addClass(trmrkCssClasses.hidden);
        this.titleExpandButton.removeClass(trmrkCssClasses.hidden);
    }
}