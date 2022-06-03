import { Trmrk as trmrk } from './core.js';
import { DomHelper } from './DomHelper.js';

trmrk.selectDomEl = async (domElId, selector, copyToClipboard) => {
    let helper = new DomHelper(domElId, selector);

    if (copyToClipboard) {
        let value = helper.DomEl.value;
        await trmrk.writeToClipboardAsync(value);
    }

    helper.DomEl.select();
    return helper.DomEl.value;
};

trmrk.textToLines = (text, maxLineLen) => {
    let lines = [];
    let textLen = text.length;

    let linesCount = Math.ceil(textLen / maxLineLen);

    let stIdx = 0;
    let endIdx = maxLineLen - 1;

    for (let i = 0; i < linesCount; i++) {
        lines[i] = text.substring(stIdx, endIdx);

        stIdx = endIdx;
        endIdx += maxLineLen;
    }

    return lines;
}

trmrk.addCssClass = (domElId, selector, cssClass, removalSelector) => {
    if (typeof (removalSelector) === "string" && removalSelector.length > 0) {
        trmrk.removeCssClass(domElId, removalSelector, cssClass);
    }

    let helper = new DomHelper(domElId, selector);

    for (let i = 0; i < helper.DomElms.length; i++) {
        let domEl = helper.DomElms[i];
        domEl.classList.add(cssClass);
    }
};

trmrk.removeCssClass = (domElId, selector, cssClass) => {
    let helper = new DomHelper(domElId, selector);

    for (let i = 0; i < helper.DomElms.length; i++) {
        let domEl = helper.DomElms[i];
        domEl.classList.remove(cssClass);
    }
};

trmrk.getDomElValue = (domElId, selector) => {
    let helper = new DomHelper(domElId, selector);
    return helper.DomEl.value;
};

trmrk.setDomElValue = (domElId, selector, value) => {
    let helper = new DomHelper(domElId, selector);
    helper.DomEl.value = value;
};

trmrk.getDomElInnerText = (domElId, selector) => {
    let helper = new DomHelper(domElId, selector);
    return helper.DomEl.innerText;
};

trmrk.getDomElInnerHTML = (domElId, selector) => {
    let helper = new DomHelper(domElId, selector);
    return helper.DomEl.innerHTML;
};

trmrk.getDomElOuterHTML = (domElId, selector) => {
    let helper = new DomHelper(domElId, selector);
    return helper.DomEl.outerHTML;
};

trmrk.openModal = modalId => {
    var modalEl = document.getElementById(modalId);
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.show();
}

trmrk.closeModal = modalId => {
    var modalEl = document.getElementById(modalId);
    var modal = bootstrap.Modal.getInstance(modalEl);

    modal.hide();
}

trmrk.showPopover = (domElId, selector, autohideMillis) => {
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

trmrk.hidePopover = (domElId, selector) => {
    let helper = new DomHelper(domElId, selector);
    var popover = bootstrap.Popover.getInstance(helper.DomEl);

    popover.hide();
}