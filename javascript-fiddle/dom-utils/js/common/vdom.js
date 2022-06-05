import { trmrk as trmrk } from './core.js';
import { domUtils, bsDomUtils } from './domUtils.js';

export class VDomNodeBase {
    isVNode = true;
    isTextNode = false;

    domNode;
    textValue;
    data;

    setDomNode(domNode) {
        this.domNode = domNode;
    }

    createDomNode() {
    }

    setTextValue(textValue) {
        this.textValue = textValue;
    }

    refreshTextValue() {
        if (this.domNode) {
            this.textValue = this.domNode.textContent;
        } else {
            this.textValue = null;
        }
        
        return this.textValue;
    }
}

export class VDomTextNode extends VDomNodeBase {

    constructor(value) {
        super();
        this.isTextNode = true;

        if (trmrk.core.isOfTypeString(value)) {
            this.textValue = value;
        } else if (trmrk.core.isNotNullObj(value)) {
            this.setDomNode(value);
        }
    }

    setDomNode(domNode) {
        super.setDomNode(domNode);
        this.textValue = domNode.textContent;
    }

    createDomNode() {
        let textNode = document.createTextNode(this.textValue);
        this.setDomNode(textNode);

        return textNode;
    }
}

export class VDomEl extends VDomNodeBase {
    nodeName = null;
    attrs = {};
    classList = [];
    events = {};
    childNodes = [];

    constructor(props, callback) {
        super();

        if (trmrk.core.isNotNullObj(props)) {
            let domNode, data, textValue, nodeName, classList, attrs, events, childNodes;
            ({domNode, data, textValue, nodeName, classList, attrs, events, childNodes} = props);

            this.domNode = domNode;

            if (!trmrk.core.isNullOrUndef(data)) {
                this.data = data;
            }

            if (trmrk.core.isNonEmptyString(textValue)) {
                this.textValue = textValue;
            }

            if (trmrk.core.isOfTypeString(nodeName)) {
                this.nodeName = nodeName;
            }

            if (trmrk.core.isNotNullObj(classList)) {
                this.classList = classList;
            } else {
                this.classList = [];
            }

            if (trmrk.core.isNotNullObj(attrs)) {
                this.attrs = attrs;
            } else {
                this.attrs = {};
            }

            if (trmrk.core.isNotNullObj(events)) {
                this.events = events;
            } else {
                this.events = {};
            }

            if (trmrk.core.isNotNullObj(childNodes)) {
                this.childNodes = childNodes;
            } else {
                this.childNodes = [];
            }
        } else if (trmrk.core.isOfTypeString(props)) {
            this.nodeName = props;
        }

        if (trmrk.core.isOfTypeFunction(callback)) {
            callback(this);
        }
    }

    setDomNode(domNode) {
        if (this.domNode) {
            this.removeAllEventListeners();
        }

        super.setDomNode(domNode);
        this.refreshNodeName();

        this.attrs = {};
        this.classList = [];
    }

    setDomEl(domNode) {
        this.setDomNode(domNode);

        this.refreshAttrs();
        this.refreshClassList();
        this.refreshChildNodes();
    }

    setTextValue(textValue) {
        if (this.domNode) {
            if (trmrk.vdom.utils.textInputElNodeNames.indexOf(this.nodeName) >= 0) {
                this.domNode.value = textValue;
            } else {
                this.domNode.textContent = textValue;
                this.refreshChildNodes();
            }
        }

        super.setTextValue(textValue);
    }

    refreshNodeName() {
        if (this.domNode) {
            this.nodeName = this.domNode.nodeName;
        } else {
            this.nodeName = null;
        }
    }

    refreshTextValue() {
        if (this.domNode && trmrk.vdom.utils.textInputElNodeNames.indexOf(this.nodeName) >= 0) {
            this.textValue = this.domNode.value;
        } else {
            super.refreshTextValue();
        }

        return this.textValue;
    }

    refreshAttrs() {
        this.attrs = {};

        for (let i = 0; i < this.domNode.attributes.length; i++) {
            let attr = this.domNode.attributes[0];
            let attrName = attr.name;

            if (attrName !== "class") {
                let attrValue = attr.value;
                this.attrs[attrName] = attrValue;
            }
        }
    }

    refreshClassList() {
        this.classList = [];

        for (let value of this.domNode.classList.keys()) {
            this.classList.push(value);
        }
    }

    refreshChildNodes() {
        this.childNodes = [];

        if (this.domNode.hasChildNodes()) {
            let children = this.domNode.childNodes;

            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let nodeType = child.nodeType;

                let nodeName = child.nodeName;
                let childVNode;

                switch (nodeType) {
                    case Node.TEXT_NODE:
                        if (trmrk.vdom.utils.nonVDomElNodeNames.indexOf(nodeName) < 0) {
                            childVNode = new VDomTextNode();
                            childVNode.setDomNode(child);
                        }
                        break;
                    case Node.ELEMENT_NODE:
                        childVNode = new VDomEl();
                        childVNode.setDomEl(child);
                        break;
                }
            }
        }
    }
    
    createDomNode() {
        let domEl = document.createElement(this.nodeName);

        for (let key of Object.keys(this.attrs)) {
            var value = this.attrs[key];
            domEl.setAttribute(key, value);
        }

        for (let className of this.classList) {
            domEl.classList.add(className);
        }

        for (let eventType of Object.keys(this.events)) {
            let eventsArr = this.events[eventType];

            for (let event of eventsArr) {
                let listener, options;
                ({listener, options} = event);

                trmrk.vdom.utils.addEventListener(domEl, eventType, listener, options);
            }
        }

        if (trmrk.core.isNonEmptyString(this.textValue)) {
            if (trmrk.vdom.utils.textInputElNodeNames.indexOf(this.nodeName) >= 0) {
                domEl.value = this.textValue;
            } else {
                domEl.textContent = this.textValue;
            }
        }

        this.childNodes = this.childNodes.map(trmrk.vdom.utils.getOrCreateDomNode);

        for (let childVNode of this.childNodes) {
            if (!childVNode.domNode) {
                childVNode.createDomNode();
            }

            domEl.appendChild(childVNode.domNode);
        }

        this.domNode = domEl;
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

    addClass(className) {
        this.domNode.classList.add(className);
        this.classList.push(className);
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
                this.classList.push(className);
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
            list.push(value);
        }

        for (let i = 0; i < list.length; i++) {
            this.domNode.classList.remove(list[i]);
        }

        this.classList = [];
    }

    addEventListener(type, listener, options) {
        let eventsArr = this.events[type];

        if (typeof(eventsArr) !== "object") {
            eventsArr = [];
            this.events[type] = eventsArr;
        }

        trmrk.vdom.utils.addEventListener(this.domNode, type, listener, options);
        
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
            
            let listener, options;
            ({listener, options} = eventInstn);    

            trmrk.vdom.utils.removeEventListener(this.domNode, type, listener, options);
        }
    }

    removeAllEventListeners() {
        for (let type of Object.keys(this.events)) {
            let eventsArr = this.events[type];

            while (eventsArr.length > 0) {
                let event = eventsArr.pop();
                let listener, options;

                ({listener, options} = event);
                trmrk.vdom.utils.removeEventListener(this.domNode, type, listener, options);
            }
        }

        this.events = {};
    }

    appendChildVNode(vNode) {
        vNode = trmrk.vdom.utils.getOrCreateDomNode(vNode);
        this.domNode.appendChild(vNode.domNode);

        this.childNodes.push(vNode);
        return vNode;
    }

    removeChildVNode(vNode) {
        this.domNode.removeChild(vNode.domNode);
        let idx = this.childNodes.indexOf(vNode);

        if (idx >= 0) {
            this.childNodes.splice(idx, 1);
        }
    }

    removeAllChildVNodes() {
        while (this.childNodes.length > 0) {
            let vNode = this.childNodes.pop();
            this.domNode.removeChild(vNode);
        }
    }
}

export class VirtualDomUtils {
    nonVDomElNodeNames = ["script", "style"];
    textInputElNodeNames = ["input", "textarea"];

    getOrCreateDomNode(node) {
        let vNode = node;

        if (!node.isVNode) {
            if (node.isTextNode) {
                vNode = new VDomTextNode(node);
            } else {
                vNode = new VDomEl(node);
            }
        }

        return vNode;
    }

    getVDomEl(nodeName, classList, attrs, childNodes, events, textValue, data, domNode) {
        let vDomEl = new VDomEl({
            nodeName: nodeName,
            classList: classList,
            attrs: attrs,
            events: events,
            childNodes,
            textValue: textValue,
            data: data,
            domNode: domNode
        });

        return vDomEl;
    }

    removeEventListener(domNode, type, listener, options) {
        if (trmrk.core.isNullOrUndef(options)) {
            domNode.removeEventListener(type, listener);
        } else {
            domNode.removeEventListener(type, listener, options);
        }
    }

    addEventListener(domNode, type, listener, options) {
        if (trmrk.core.isNullOrUndef(options)) {
            domNode.addEventListener(type, listener);
        } else {
            domNode.addEventListener(type, listener, options);
        }
    }
}

export class VirtualDom {
    utils = new VirtualDomUtils();
    rootVDomEl = null;

    init(rootVNodesArr) {
        let rootNode = new VDomEl();
        rootNode.setDomEl(document.body);
        vdom.rootNode = rootNode;

        for (let vNode of rootVNodesArr) {
            if (!vNode.isVNode) {
                vNode = this.utils.getOrCreateDomNode(vNode);
            }

            if (!vNode.domNode) {
                vNode.createDomNode();
                rootNode.appendChildVNode(vNode);
            }
        }
    }
}

trmrk.types["VDomNodeBase"] = VDomNodeBase;
trmrk.types["VDomTextNode"] = VDomTextNode;
trmrk.types["VirtualDom"] = VirtualDom;

const vdomInstnt = new VirtualDom();
trmrk.vdom = vdomInstnt;
export const vdom = vdomInstnt;
