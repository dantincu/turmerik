import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { BasicVDomElProps } from './domUtils.js';
import { bsDomUtils, domUtils } from './main.js';
import { vdom, VDomEl, VDomTextNode } from './vdom.js';

export class BsToggleButtonOpts extends ViewModelBase {
    nodeName;
    classList;
    attrs;
    targetSelector;
    targetVDomEl;

    collapsedProps;
    expandedProps;

    isCollapsed;
    changePropsOnToggle;

    constructor(src) {
        super();
        this.__copyProps(src, true);

        this.nodeName = this.nodeName ?? "button";
        this.classList = this.classList ?? [ "btn" ];

        this.attrs = this.attrs ?? {
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": this.targetSelector
        };

        this.collapsedProps = new BasicVDomElProps(this.collapsedProps, {
            textValue: "+",
            classList: [ "btn-primary" ]
        });

        this.changePropsOnToggle = !(!this.expandedProps) && !(!this.targetVDomEl);
        this.expandedProps = new BasicVDomElProps(this.expandedProps, this.collapsedProps);
        
        this.isCollapsed = this.isCollapsed ?? true;
    }
}

export class BsToggleButtonVDomEl extends VDomEl {
    opts;
    isCollapsed;

    constructor(opts) {
        const tOpts = new BsToggleButtonOpts(opts);

        super({
            nodeName: tOpts.nodeName,
            attrs: tOpts.attrs,
            classList: tOpts.classList
        });

        this.opts = tOpts;
        this.isCollapsed = tOpts.isCollapsed;

        if (this.opts.targetVDomEl) {
            this.opts.targetVDomEl.addClass("collapse");

            if (this.isCollapsed) {
                this.opts.targetVDomEl.removeClass("show");
            } else {
                this.opts.targetVDomEl.addClass("show");
            }
        }

        this.onToggled(tOpts.isCollapsed);

        if (this.opts.changePropsOnToggle) {
            this.opts.targetVDomEl.addEventListener("shown.bs.collapse", () => {
                this.onToggled(false);
            });

            this.opts.targetVDomEl.addEventListener("hidden.bs.collapse", () => {
                this.onToggled(true);
            });
        }
    }

    onToggled(isCollapsed) {
        if (isCollapsed) {
            this.setTextValue(this.opts.collapsedProps.textValue);

            this.removeManyClasses(this.opts.expandedProps.classList);
            this.addManyClasses(this.opts.collapsedProps.classList);
        } else {
            this.setTextValue(this.opts.expandedProps.textValue);

            this.removeManyClasses(this.opts.collapsedProps.classList);
            this.addManyClasses(this.opts.expandedProps.classList);
        }

        this.isCollapsed = isCollapsed;
    }
}

export const getBsToggleButton = (targetSelector,
    isCollapsed, targetVDomEl, collapsedProps,
    expandedProps, classList, attrs, nodeName) => {
        const opts = {
            nodeName: nodeName,
            classList: classList,
            attrs: attrs,
            targetSelector : targetSelector,
            targetVDomEl: targetVDomEl,
            collapsedProps: collapsedProps,
            expandedProps: expandedProps,
            isCollapsed: isCollapsed
        };

        const buttonVDomEl = new BsToggleButtonVDomEl(opts);
        return buttonVDomEl;
}