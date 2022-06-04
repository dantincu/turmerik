import { trmrk as trmrk } from './core.js';
import { domUtils, bsDomUtils } from './domUtils.js';

export class VDomNodeBase {
    domNode;

    setDomNode(domNode) {
        this.domNode = domNode;
    }

    createDomNode() {
    }
}

export class VDomTextNode extends VDomNodeBase {
    textValue;

    constructor(textValue) {
        this.textValue = textValue;
    }

    createDomNode() {
        let textNode = document.createTextNode(this.textValue);
        this.setDomNode(textNode);

        return textNode;
    }
}

export class VDomEl extends VDomNodeBase {
    nodeName = null;
    classList = [];
    attrs = {};
    events = {};

    addEventListener(type, listener, options) {
        let eventsArr = this.events[type];

        if (typeof(eventsArr) !== "object") {
            eventsArr = [];
            this.events[type] = eventsArr;
        }

        this.domNode.addEventListener(type, listener, options);

        eventsArr.push({
            listener: listener,
            options: options
        })
    }

    removeEventListener(type, idx) {
        let eventsArr = this.events[type];

        if (typeof(eventsArr) !== "object") {
            throw "There are no events registered for type " + type;
        }
        
        if (typeof(idx) !== "number") {
            idx = eventsArr.length - 1;
            let eventInstn = eventsArr.splice(idx, 1);
            
            let type, listener, options;
            ({listener, options} = eventInstn);

            this.domNode.removeEventListener(type, listener, options);
        }
    }
    
    createDomNode() {
        let domEl = document.createElement(this.nodeName);

        Object.keys(this.attrs).forEach(function (key) { 
            var value = this.attrs[key];
            domEl.setAttribute(key, value);
        });

        for (let i = 0; i < this.classList.length; i++) {
            domEl.classList.add(this.classList[i]);
        }

        this.setDomNode(domEl);
        return domEl;
    }

    addAttr(key, value) {
        if (key.toLowerCase() === "class") {
            throw "Class attribute cannot be set directly";
        }

        this.domNode.setAttribute(key, value);
        this.attrs[key] = value;
    }

    removeAttr(key) {
        if (key.toLowerCase() === "class") {
            throw "Class attribute cannot be removed directly";
        }

        this.domNode.removeAttribute(key);
        delete this.attrs[key];
    }

    removeAllAttrs() {
        while (this.domNode.attributes.length > 0) {
            let attr = this.domNode.attributes.length[0];
            let attrName = attr.name;

            this.domNode.removeAttribute(attrName);
        }

        this.attrs = {};
    }

    refreshAttrs() {
        this.attrs = {};

        for (let i = 0; i < this.domNode.attributes.length; i++) {
            let attr = this.domNode.attributes.length[0];

            let attrName = attr.name;
            let attrValue = attr.value;

            this.attrs[attrName] = attrValue;
        }
    }

    addClass(className) {
        this.domNode.classList.add(className);
        this.classList.add(className);
    }

    removeClass(className) {
        this.domNode.classList.remove(className);
        let idx = this.classList.indexOf(className);

        if (idx >= 0) {
            this.classList.splice(idx, 1);
        }
    }

    toggleClass(className) {
        let idx = this.classList.indexOf(className);

        if (this.domNode.classList.toggle(className)) {
            if (idx < 0) {
                this.classList.add(className);
            }
        } else {
            if (idx >= 0) {
                this.classList.splice(idx, 1);
            }
        }
    }

    removeAllClasses() {
        const list = [];

        for (let value of this.domNode.classList.keys()) {
            list.add(value);
        }

        for (let i = 0; i < list.length; i++) {
            this.domNode.classList.remove(list[i]);
        }

        this.classList = [];
    }

    refreshClassList() {
        this.classList = [];

        for (let value of this.domNode.classList.keys()) {
            this.classList.add(value);
        }
    }
}

export class VirtualDom {
    rootVDomEl = null;

    init() {
        // vdom.rootNode = 
    }
}

trmrk.types["VDomNodeBase"] = VDomNodeBase;
trmrk.types["VDomTextNode"] = VDomTextNode;
trmrk.types["VirtualDom"] = VirtualDom;

const vdomInstnt = new VirtualDom();
trmrk.vdom = vdomInstnt;

export const vdom = vdomInstnt;
export const domUtils = domUtilsInstn;
export const bsDomUtils = bsDomUtilsInstn;