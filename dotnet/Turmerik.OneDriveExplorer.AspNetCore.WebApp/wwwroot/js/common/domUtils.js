import { trmrk, StrIndentOpts } from './core.js';
import { DomHelper } from './DomHelper.js';
import { ViewModelBase } from './ViewModelBase.js';

export class DomElTagHtmlStrOpts extends ViewModelBase {
    nodeName;
    attrs;
    classList;
    isSelfClosingTag;
    childNodes;
    indentOpts;
    textValue;
    sanitizeText;

    constructor(src) {
        super();
        this.__copyProps(src, true, true);

        if (!trmrk.core.isNotNaNNumber(indent)) {
            this.indent = !(!indent);
        }

        this.indentOpts = new StrIndentOpts(this.indentOpts);
        this.sanitizeText = !(!sanitizeText);

        if (this.isSelfClosingTag && (this.childNodes || trmrk.core.isNonEmptyString(this.textValue))) {
            throw "A self closing tag cannot have child nodes or text value";
        }
    }
}

export class DomUtils {
    trmrkDOMContentLoadedGlobalPropName = "trmrkDOMContentLoaded";

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

    createAndAppendEl(parentEl, nodeName, textContent) {
        let el = document.createElement(nodeName);
        el.textContent = textContent;

        parentEl.appendChild(el);
    }

    onDomContentLoaded(callbackArg) {
        let callback = () => {
            let callbackPropName = this.trmrkDOMContentLoadedGlobalPropName;
            let globalCallback = window[callbackPropName];

            if (globalCallback) {
                delete window[callbackPropName];
                globalCallback();
            }

            if (callbackArg) {
                callbackArg();
            }
        }

        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                callback();
            });
        }
    }

    replaceElWith(srcEl, trgEl) {
        const parentEl = trgEl.parentNode;
        parentEl.replaceChild(srcEl, trgEl);
    }

    getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    getDomElmsArrHtmlStr(optsArr) {
        const strArr = optsArr.map(
            opts => this.getDomElHtmlStr(opts)
        );

        const retStr = strArr.join("\n");
        return retStr;
    }

    getDomElHtmlStr(opts) {
        const tOpts = new DomElTagHtmlStrOpts(opts);
        let strArr = [];

        const domElStartTagStr = this.getHtmlTagStr(
            tOpts.tagName, tOpts.attrs, tOpts.classList, tOpts.isSelfClosingTag
        );

        strArr.push(domElStartTagStr);

        if (!isSelfClosingTag) {
            let indentVal = -1;
            let indentStr = "";

            if (trmrk.core.isNotNaNNumber(tOpts.indent)) {
                indentVal = tOpts.indent;

                if (indentVal > 0) {
                    indentStr = trmrk.core.range(indentVal, k => tOpts.indentStr).reduce(
                        (a, b) => a + b
                    );
                }
            } else if (tOpts.indent === true) {
                indentVal = 0;
            }
            
            if (tOpts.childNodes) {
                let childNodeOpts = tOpts.childNodes;
                
                if (indentVal >= 0) {
                    childNodeOpts = tOpts.childNodes.map(
                        childOpts => {
                            childOpts.indent = {
                                indent: indentVal + 1,
                                indentStr: tOpts.indentStr
                            };

                            return childOpts;
                        });
                }

                const childNodeStrsArr = this.getDomElmsArrHtmlStr(childNodeOpts);
                strArr.splice(1, 0, childNodeStrsArr);
            } else if (trmrk.core.isNonEmptyString(tOpts.textValue)) {
                strArr.push(tOpts.textValue);
            }

            const domElEndTagStr = this.getHtmlTagStr(
                tOpts.tagName, null, null, false, true);

            strArr.push(domElEndTagStr);

            if (indentVal > 0) {
                strArr = strArr.map(part => indentStr + part);
            }
        }

        const retStr = strArr.join("\n");
        return retStr;
    }

    getHtmlTagStr(tagName, attrs = {}, classList = [], isSelfClosingTag = true, isEndTag = false) {
        isEndTag = isEndTag && !isSelfClosingTag && !attrs && !classList;
        const strParts = ['<'];

        if (isEndTag) {
            strParts.push('/');
            strParts.push(tagName);
            strParts.push('>');
        } else {
            strParts.push(tagName);

            attrs = attrs ?? {};
            classList = classList ?? [];

            if (classList.length > 0) {
                const classStrVal = classList.join(" ");
                attrs["class"] = classStrVal;
            }

            const attrsStrVal = this.getHtmlAttrs(attrs);

            if (!trmrk.core.isNonEmptyString(attrsStrVal)) {
                attrsStrVal = [" ", attrsStrVal, " "].join("");
                strParts.push(attrsStrVal);
            }

            if (isSelfClosingTag) {
                strParts.push("/");
            }

            strParts.push(">");
        }

        const retStr = strParts.join("");
        return retStr;
    }

    getHtmlAttrs(attrs) {
        const strArr = Object.keys(attrs).map(
            key => [key, '=', trmrk.core.escapeStr(attrs[key], '"', true)].join("")
        );

        const retStr = strArr.join(" ");
        return retStr;
    }
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

    createPopover(domElId, selector) {
        let helper = new DomHelper(domElId, selector);
        var popover = bootstrap.Popover.getOrCreateInstance(helper.DomEl);

        return popover;
    }

    showPopover(domElId, selector, autohideMillis) {
        let helper = new DomHelper(domElId, selector);
        var popover = bootstrap.Popover.getOrCreateInstance(helper.DomEl);        

        popover.show();
        let retVal = -1;

        if (typeof (autohideMillis) === "number") {
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

export class TrmrkCssClasses {
    hidden = "trmrk-hidden";
    rotate45Deg = "trmrk-rotate-45deg";
    rotate90Deg = "trmrk-rotate-90deg";
    timesIcon = "trmrk-times-icon";
    plusIcon = "trmrk-plus-icon";
    minusIcon = "trmrk-minus-icon";
    icon = "trmrk-icon";
    editMode = "trmrk-edit-mode";
    checked = "trmrk-checked";
    pressed = "trmrk-pressed";
    iconsRow = "trmrk-icons-row";
    isInvalid = "trmrk-is-invalid";
    waiting = "trmrk-waiting";
    collapsed = "trmrk-collapsed";
    expanded = "trmrk-expanded";
    header = "trmrk-header";
    body = "trmrk-body";
    part = "trmrk-part";
    item = "trmrk-item";
    group = "trmrk-group";
    section = "trmrk-section";
    sectionsGroup = "trmrk-sections-group";
    readonly = "trmrk-readonly";
    editable = "trmrk-editable";
    mainText = "trmrk-main-text";
    description = "trmrk-main-text";
    mainContent = "trmrk-main-content";
    mainChildNodes = "trmrk-child-nodes";
    loadingContainer = "trmrk-loading-container";
}

export class BasicVDomElProps extends ViewModelBase {
    textValue;
    classList;

    constructor(src, defaults) {
        super();
        this.__copyProps(src);

        if (trmrk.core.isNotNullObj(defaults)) {
            trmrk.core.merge(this, defaults);
        }

        this.classList = this.classList ?? [];

        if (trmrk.core.isNotNullObj(classList)) {
            classList.sort();
        }
    }

    equals(src) {
        let retVal = this.textValue === src.textValue;

        if (!retVal) {
            retVal = !trmrk.core.isNonEmptyString(
                this.textValue) && !trmrk.core.isNonEmptyString(src.textValue);
        }

        if (retVal) {
            retVal = this.classList === src.classList;

            if (!retVal) {
                const srcClassList = src.classList ?? [];
                retVal = srcClassList.length === this.classList.length;

                if (retVal && this.classList.length > 0) {
                    retVal = src.classList.map(
                        cssClass => this.classList.indexOf(cssClass) >= 0
                    ).reduce((a, b) => a && b);
                }
            }
        }

        return retVal;
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
export const trmrkCssClasses = new TrmrkCssClasses();