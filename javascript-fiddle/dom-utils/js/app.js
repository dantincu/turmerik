import { trmrk, domUtils, bsDomUtils, vdom, webStorage } from './common/main.js';
import { VDomEl, VDomTextNode } from './common/vdom.js';

export class App {
    sessionStorageKeys = {
        vdom: "trmrk-vdom",
        css: "trmrk-css",
        js: "trmrk-js"
    }

    init() {
        let vdomJson = sessionStorage.getItem(this.sessionStorageKeys.vdom);
        let cssStr = sessionStorage.getItem(this.sessionStorageKeys.css);
        let jsStr = sessionStorage.getItem(this.sessionStorageKeys.js);

        let urlQuery = trmrk.core.urlQuery;
        let edit = urlQuery.get("edit") === "true";

        if (edit) {
            this.initEditPage(vdomJson, cssStr, jsStr);
        } else {
            this.initMainPage(vdomJson, cssStr, jsStr);
        }
    }

    getNavBarEl(edit) {
        let viewEditToggleHandler;
        let viewEditToggleName;
        
        if (edit) {
            viewEditToggleHandler = e => this.gotoMainPage();
            viewEditToggleName = "View";
        } else {
            viewEditToggleHandler = e => this.gotoEditPage();
            viewEditToggleName = "Edit";
        }

        let viewEditToggleEl = vdom.utils.getVDomEl(
            "a", ["navbar-brand"], {"href": "javascript:void(0);"}, [
                new VDomTextNode(viewEditToggleName)
            ], {
                "click": [{
                    listener: viewEditToggleHandler
                }]
            });

        let rootEl = vdom.utils.getVDomEl(
            "nav", [
                "navbar",
                "navbar-expand-md",
                "navbar-dark",
                "bg-dark",
                "fixed-top",
                "trmrk-nav-bar"
        ], {}, [
            vdom.utils.getVDomEl("a", ["navbar-brand", "trmrk-navbar-brand"], {}, [viewEditToggleEl])
        ]);

        return rootEl;
    }

    getPageMainEl(appClassName, childNodes) {
        let rootNode = new VDomEl({
            nodeName: "main",
            attrs: {
                "role": "main"
            },
            classList: ["container", appClassName],
            childNodes: childNodes
        });

        return rootNode;
    }

    initMainPage(vdomJson, cssStr, jsStr) {
        let navBarEl = this.getNavBarEl(false);
        let childNodes = [];

        if (trmrk.core.isNonEmptyString(vdomJson)) {
            childNodes = JSON.parse(vdomJson);
        }

        let rootNode = this.getPageMainEl("trmrk-app", childNodes);
        vdom.init([navBarEl, rootNode]);

        if (trmrk.core.isNonEmptyString(cssStr)) {
            domUtils.createAndAppendEl(
                document.head,
                "style",
                cssStr
            );
        }

        if (trmrk.core.isNonEmptyString(jsStr)) {
            domUtils.createAndAppendEl(
                document.body,
                "script",
                jsStr
            );
        }
    }

    initEditPage(vdomJson, cssStr, jsStr) {
        let navBarEl = this.getNavBarEl(true);

        let childNodes = [
            this.getEditPageRootNode(
                this.sessionStorageKeys.vdom,
                "Edit Virtual DOM", vdomJson
            ),
            this.getEditPageRootNode(
                this.sessionStorageKeys.js,
                "Edit Javascript", jsStr
            ),
            this.getEditPageRootNode(
                this.sessionStorageKeys.css,
                "Edit CSS", cssStr
            ),
        ];

        let rootNode = this.getPageMainEl("trmrk-app-edit-src", childNodes);
        vdom.init([navBarEl, rootNode]);
    }

    getEditPageRootNode(key, name, text) {
        let textareaVEl = vdom.utils.getVDomEl(
            "textarea", [], {}, [], {}, text);

        let textAreaWrapperVEl = vdom.utils.getVDomEl(
            "div", ["trmrk-content"], {
                "style": "display: none"
            }, [textareaVEl]);

        let saveButtonVEl = vdom.utils.getVDomEl("button", [], {
            "disabled": "disabled"
        }, [new VDomTextNode("save")], {
            "click": [{
                    listener: e => {
                        let newText = textareaVEl.refreshTextValue();
                        sessionStorage.setItem(key, newText);
                    }
                }]
            });

        let chkVEl = vdom.utils.getVDomEl("input", [], {
            "type": "checkbox" }, [], {
            "click": [{
                    listener: e => {
                        if (chkVEl.domNode.checked) {
                            saveButtonVEl.removeAttr("disabled");
                            textAreaWrapperVEl.domNode.style.display = "block";
                        } else {
                            saveButtonVEl.addAttr("disabled", "disabled");
                            textAreaWrapperVEl.domNode.style.display = "none";
                        }
                    }
                }]
            }
        );

        let labelVEl = vdom.utils.getVDomEl("label", ["trmrk-label"], {}, [new VDomTextNode(name), chkVEl]);
        let titleVEl = vdom.utils.getVDomEl("div", ["trmrk-summary"], {}, [labelVEl, saveButtonVEl]);
        
        let wrapperVEl = vdom.utils.getVDomEl("div", ["trmrk-item"], {}, [titleVEl, textAreaWrapperVEl]);
        return wrapperVEl;
    }

    gotoEditPage() {
        let urlQuery = trmrk.core.urlQuery;
        urlQuery.set("edit", "true");

        trmrk.core.openUrl(urlQuery);
    }

    gotoMainPage() {
        let urlQuery = trmrk.core.urlQuery;
        urlQuery.delete("edit");

        trmrk.core.openUrl(urlQuery);
    }
}

const appInstn = new App();
trmrk.app = appInstn;

export const app = appInstn;
