import { trmrk } from './core.js';
import { DomHelper } from './DomHelper.js';

export class DomUtils {
    async selectDomEl(domElId, selector, copyToClipboard) {
        let helper = new DomHelper(domElId, selector);

        if (copyToClipboard) {
            let value = helper.DomEl.value;
            await trmrk.core.writeToClipboardAsync(value);
        }

        helper.DomEl.select();
        return helper.DomEl.value;
    }

    addCssClass(domElId, selector, cssClass, removalSelector) {
        if (typeof (removalSelector) === "string" && removalSelector.length > 0) {
            removeCssClass(domElId, removalSelector, cssClass);
        }

        let helper = new DomHelper(domElId, selector);

        for (let i = 0; i < helper.DomElms.length; i++) {
            let domEl = helper.DomElms[i];
            domEl.classList.add(cssClass);
        }
    };

    removeCssClass(domElId, selector, cssClass) {
        let helper = new DomHelper(domElId, selector);

        for (let i = 0; i < helper.DomElms.length; i++) {
            let domEl = helper.DomElms[i];
            domEl.classList.remove(cssClass);
        }
    };

    getDomElValue (domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        return helper.DomEl.value;
    };

    setDomElValue(domElId, selector, value) {
        let helper = new DomHelper(domElId, selector);
        helper.DomEl.value = value;
    };

    getDomElInnerText(domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        return helper.DomEl.innerText;
    };

    getDomElInnerHTML(domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        return helper.DomEl.innerHTML;
    };

    getDomElOuterHTML(domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        return helper.DomEl.outerHTML;
    };
}

export class BsDomUtils {
    openModal(modalId) {
        var modalEl = document.getElementById(modalId);
        var modal = bootstrap.Modal.getOrCreateInstance(modalEl);

        modal.show();
    }

    closeModal(modalId) {
        var modalEl = document.getElementById(modalId);
        var modal = bootstrap.Modal.getInstance(modalEl);

        modal.hide();
    }

    showPopover(domElId, selector, autohideMillis) {
        let helper = new DomHelper(domElId, selector);
        var popover = bootstrap.Popover.getOrCreateInstance(helper.DomEl);

        popover.show();
        let retVal = -1;

        if (typeof (autohideMillis) == "number") {
            retVal = setTimeout(() => {
                popover.hide();
            }, autohideMillis);
        }

        return retVal;
    }

    hidePopover(domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        var popover = bootstrap.Popover.getInstance(helper.DomEl);

        popover.hide();
    }
}

trmrk.types["DomUtils"] = DomUtils;
trmrk.types["BsDomUtils"] = BsDomUtils;

const domUtilsInstn = new DomUtils();
const bsDomUtilsInstn = new BsDomUtils();

trmrk.domUtils = domUtilsInstn;
trmrk.bsDomUtils = bsDomUtilsInstn;

export const domUtils = domUtilsInstn;
export const bsDomUtils = bsDomUtilsInstn;