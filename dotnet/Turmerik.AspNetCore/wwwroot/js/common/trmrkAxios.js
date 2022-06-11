import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';

export class TrmrkAxiosApiResult extends ViewModelBase {
    constructor(src, throwOnUnknownProp = false) {
        super();
        this.__copyProps(src, throwOnUnknownProp);
    }

    isSuccess = null;
    data = null;
    status = null;
    statusText = null;
    headers = null;
    config = null;
    request = null;

    /* {
        // `data` is the response that was provided by the server
        data: {},

        // `status` is the HTTP status code from the server response
        status: 200,

        // `statusText` is the HTTP status message from the server response
        statusText: 'OK',

        // `headers` the HTTP headers that the server responded with
        // All header names are lowercase and can be accessed using the bracket notation.
        // Example: `response.headers['content-type']`
        headers: {},

        // `config` is the config that was provided to `axios` for the request
        config: {},

        // `request` is the request that generated this response
        // It is the last ClientRequest instance in node.js (in redirects)
        // and an XMLHttpRequest instance in the browser
        request: {}
    } */
}

export class TrmrkAxios {
    async request(requestFunc) {
        let apiResult = new TrmrkAxiosApiResult();
        
        try {
            apiResult = await requestFunc();
        } catch (exc) {
            apiResult = {
                exc: exc,
                status: 500,
                statusText: 'Unknown error',
            }
        }

        this.setApiResultSuccessFlag(apiResult);
        return apiResult;
    }

    async get(url, opts) {
        let apiResult = await this.request(
            async () => await axios.get(url, opts));

        return apiResult;
    }

    async put(url, opts) {
        let apiResult = await this.request(
            async () => await axios.put(url, opts));

        return apiResult;
    }

    async post(url, opts) {
        let apiResult = await this.request(
            async () => await axios.post(url, opts));

        return apiResult;
    }

    async delete(url, opts) {
        let apiResult = await this.request(
            async () => await axios.delete(url, opts));

        return apiResult;
    }

    setApiResultSuccessFlag(apiResult) {
        if (apiResult.status === 200) {
            apiResult.isSuccess = true;
        } else {
            apiResult.isSuccess = false;
        }
    }
}

trmrk.types["TrmrkAxiosApiResult"] = TrmrkAxiosApiResult;
trmrk.types["TrmrkAxios"] = TrmrkAxios;

const trmrkAxiosInstn = new TrmrkAxios();
export const trmrkAxios = trmrkAxiosInstn;