import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { BasicVDomElProps, trmrkCssClasses } from './domUtils.js';
import { bsDomUtils, domUtils } from './main.js';
import { vdom, VDomEl, VDomTextNode } from './vdom.js';
import { BasicVDomElOpts, BasicVDomEl } from './BasicVDomEl.js';
import { TrmrkAxiosApiResult } from './trmrkAxios.js';
import { BsStaticContentModalVDomEl, BsStaticContentModalVDomElOpts } from './BsStaticContentModalVDomEl.js';

export class BsApiContentModalVDomElOpts extends BsStaticContentModalVDomElOpts {
}

export class BsApiContentModalVDomEl extends BsStaticContentModalVDomEl {
    apiResult;
    isLoading;

    loadingVDomEl;
    dataVDomEl;
    errorVDomEl;
    errorStatusVDomEl;
    errorStatusTitleVDomEl;
    errorStatusTextVDomEl;

    assignOpts(opts) {
        this.opts = new BsApiContentModalVDomElOpts(opts);
    }

    async assureDataLoadedAsync() {
        if (!this.apiResult) {
            await this.tryLoadDataAsync();
        }
    }

    async tryLoadDataAsync() {
        if (!this.isLoading) {
            this.isLoading = true;

            try {
                const apiResult = await this.loadDataCoreAsync();
                this.apiResult = new TrmrkAxiosApiResult(apiResult);
            } catch (err) {
                this.apiResult = new TrmrkAxiosApiResult({
                    statusText: err
                });
            }

            if (this.apiResult.isSuccess) {
                this.updateDataVDomEl(this.apiResult.data);
            } else {
                this.updateErrorVDomEl(this.apiResult);
            }

            this.isLoading = false;
        }
    }

    async loadDataCoreAsync() {}
    updateDataVDomElCore(data) {}

    hideAllBodyNodes() {
        this.hideDataVDomEl();
        this.hideLoadingVDomEl();
        this.hideErrorVDomEl();
    }

    updateDataVDomEl(data, show = true) {
        this.updateDataVDomElCore(data);

        if (show) {
            this.showDataVDomEl();
        }
    }

    hideDataVDomEl() {
        this.dataVDomEl.addClass(trmrkCssClasses.hidden);
    }

    showDataVDomEl(hideRest = true) {
        if (hideRest) {
            this.hideAllBodyNodes();
        }
        
        this.dataVDomEl.removeClass(trmrkCssClasses.hidden);
    }

    updateErrorVDomEl(apiResult, show = true) {
        let status = apiResult.getStatusStr();
        let statusText = apiResult.getStatusText();

        this.errorStatusVDomEl.removeChildVDomNodesWhere(
            (vNode, i, rmCount) => vNode.isTextNode
        );
        
        this.errorStatusVDomEl.insertChildVNodeBefore(new VDomTextNode(status));
        this.errorStatusTitleVDomEl.setTextValue("Oops! ");
        
        this.errorStatusTextVDomEl.removeChildVDomNodesWhere(
            (vNode, i, rmCount) => vNode.isTextNode
        );
        
        this.errorStatusTextVDomEl.appendChildVNode(new VDomTextNode(statusText));
    }

    hideErrorVDomEl() {
        this.errorVDomEl.addClass(trmrkCssClasses.hidden);
    }

    showErrorVDomEl(hideRest = true) {
        if (hideRest) {
            this.hideAllBodyNodes();
        }
        
        this.errorVDomEl.removeClass(trmrkCssClasses.hidden);
    }

    hideLoadingVDomEl() {
        this.loadingVDomEl.addClass(trmrkCssClasses.hidden);
    }

    showLoadingVDomEl(hideRest = true) {
        if (hideRest) {
            this.hideAllBodyNodes();
        }
        
        this.loadingVDomEl.removeClass(trmrkCssClasses.hidden);
    }

    getBodyVDomEl() {
        this.loadingVDomEl = this.getLoadingVDomEl();
        this.dataVDomEl = this.getDataVDomEl();
        this.errorVDomEl = this.getErrorVDomEl();

        const bodyVDomEl = this.getVDomElCore(
            this.opts.bodyCssClassList, [
                this.loadingVDomEl,
                this.dataVDomEl,
                this.errorVDomEl
            ]);
        
        return bodyVDomEl;
    }

    getLoadingVDomEl() {
        const loadingVDomEl = this.getVDomElCore([
            trmrkCssClasses.loadingContainer ], [
                vdom.utils.getVDomEl("h6", [
                    trmrkCssClasses.hidden ],
                    {}, [], {}, "Loading...")
            ]);

        return loadingVDomEl;
    }

    getDataVDomEl() {
        const dataVdomEl = this.getVDomElCore([
            trmrkCssClasses.dataContainer, trmrkCssClasses.hidden ]);

        return dataVdomEl;
    }

    getErrorVDomEl() {
        this.errorStatusVDomEl = vdom.utils.getVDomEl("h5", ["display-2", "fw-bold"]);
        this.errorStatusTitleVDomEl = vdom.utils.getVDomEl("span", ["text-danger"]);

        this.errorStatusTextVDomEl = this.getVDomElCore(
            ["fs-3"], [ this.errorStatusTitleVDomEl ], "p");

        const errorVdomEl = this.getVDomElCore([ "text-center",
            trmrkCssClasses.errorContainer, trmrkCssClasses.hidden ], [
            this.errorStatusVDomEl, this.errorStatusTextVDomEl
        ]);

        return errorVdomEl;
    }
}
