import { trmrk, withVal } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { BasicVDomElProps } from './domUtils.js';
import { bsDomUtils, domUtils } from './main.js';
import { vdom, VDomEl, VDomTextNode } from './vdom.js';
import { TrmrkAxiosApiResult } from './trmrkAxios.js';
import { BasicVDomEl, BasicVDomElOpts } from './BasicVDomEl.js';
import { BsButtonVDomEl, BsButtonVDomElOpts } from './BsButtonVDomEl.js';

export class BsStaticContentModalVDomElOpts extends BasicVDomElOpts {
    modalId;
    
    dialogCssClassList;
    contentCssClassList;
    headerCssClassList;

    modalTitleVDomOpts;
    closeBtnVDomOpts;
    
    bodyCssClassList;
    footerCssClassList;

    footerCloseBtnVDomOpts;

    assignProps(src) {
        this.__copyProps(src);
        super.assignProps();

        this.attrs = this.attrs ?? {};

        if (!trmrk.core.isNonEmptyString(this.modalId)) {
            trmrk.core.merge(this.attrs, {
                id: this.modalId
            });
        }

        this.classList = this.classList ?? [ "modal" ];
        this.dialogCssClassList = this.dialogCssClassList ?? [ "modal-dialog" ];

        if (this.classList.length === 0 || this.dialogCssClassList.length === 0) {
            throw "Modal root and dialog elements both must have css classes";
        }

        this.contentCssClassList = this.contentCssClassList ?? [ "modal-content" ];
        this.headerCssClassList = this.headerCssClassList ?? [ "modal-header" ];
        
        if (this.modalTitleVDomOpts) {
            trmrk.core.merge(this.modalTitleVDomOpts, {
                nodeName: "h5",
                classList: [ "modal-title" ]
            });
        }

        if (this.closeBtnVDomOpts) {
            this.closeBtnVDomOpts = this.mergeCloseBtnVDomOpts(
                new BsButtonVDomElOpts(this.closeBtnVDomOpts),
                [ "btn-close" ]);
        }

        this.bodyCssClassList = this.bodyCssClassList ?? [ "modal-body" ];
        this.footerCssClassList = this.footerCssClassList ?? [ "modal-footer" ];

        if (this.footerCloseBtnVDomOpts) {
            this.footerCloseBtnVDomOpts = this.mergeCloseBtnVDomOpts(
                new BsButtonVDomElOpts(this.footerCloseBtnVDomOpts),
                [ "btn", "btn-secondary" ], "Close");
        }
    }

    mergeCloseBtnVDomOpts(closeBtnVDomOpts, classList, textValue) {
        trmrk.core.merge(closeBtnVDomOpts, {
            classList: classList,
            textValue: textValue
        });

        trmrk.core.merge(closeBtnVDomOpts.attrs, {
            "data-bs-dismiss": "modal"
        });

        return closeBtnVDomOpts;
    }
}

export class BsStaticContentModalVDomEl extends BasicVDomEl {
    titleVDomEl;
    headerCloseBtnVDomEl;
    headerVDomEl;

    bodyVDomEl;
    footerCloseBtnCloseVDomEl;
    footerVDomEl;
    
    contentVDomEl;
    dialogVDomEl;

    assignOpts(opts) {
        this.opts = new BsStaticContentModalVDomElOpts(opts);
    }

    init() {
        this.dialogVDomEl = this.getDialogVDomEl();
        this.childNodes.push(this.dialogVDomEl);
    }

    getDialogVDomEl() {
        this.contentVDomEl = this.getContentVDomEl();

        const dialogVDomEl = this.getVDomElCore(
            this.opts.dialogCssClassList,
            [ this.contentVDomEl ]
        );

        return dialogVDomEl;
    }

    getContentVDomEl() {
        this.headerVDomEl = this.getHeaderVDomEl();
        this.bodyVDomEl = this.getBodyVDomEl();
        this.footerVDomEl = this.getFooterVDomEl();

        const contentVDomEl = this.getVDomElCore(
            this.opts.contentCssClassList, [
                this.headerVDomEl,
                this.bodyVDomEl,
                this.footerVDomEl
            ]);
        
        return contentVDomEl;
    }

    getHeaderVDomEl() {
        this.titleVDomEl = this.getTitleVDomEl();
        this.headerCloseBtnVDomEl = this.getHeaderCloseBtnVDomEl();
        
        const headerVDomEl = this.getVDomElCore(
            this.opts.headerCssClassList, [
                this.titleVDomEl,
                this.headerCloseBtnVDomEl
            ]);
        
        return headerVDomEl;
    }

    getTitleVDomEl() {
        const titleVDomEl = withVal(this.opts.modalTitleVDomOpts, opts => new BasicVDomEl(opts));
        return titleVDomEl;
    }

    getHeaderCloseBtnVDomEl() {
        const closeBtnVDomEl = this.getCloseBtnVDomElCore(
            this.opts.closeBtnVDomElOpts);

        return closeBtnVDomEl;
    }

    getBodyVDomEl() {
        const bodyVDomEl = this.getVDomElCore(
            this.opts.bodyCssClassList);
        
        return bodyVDomEl;
    }

    getFooterVDomEl() {
        this.footerCloseBtnVDomEl = this.getFooterCloseBtnVDomEl();

        const footerVDomEl = this.getVDomElCore(
            this.opts.footerCssClassList, [
                this.opts.footerCloseBtnVDomElOpts
            ]);
        
        return footerVDomEl;
    }

    getFooterCloseBtnVDomEl() {
        const closeBtnVDomEl = this.getCloseBtnVDomElCore(
            this.opts.footerCloseBtnVDomElOpts);

        return closeBtnVDomEl;
    }

    getCloseBtnVDomElCore(closeBtnVDomElOpts) {
        const closeBtnVDomEl = withVal(closeBtnVDomElOpts, opts => new BsButtonVDomEl(opts));
        return closeBtnVDomEl;
    }
}
