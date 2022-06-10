import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { trmrkAxios, TrmrkAxiosApiResult } from './trmrkAxios.js';
import { webStorage } from './webStorage.js';

export class WebStorageAxios {
    async request(axiosReqFunc, cacheKey, storage) {
        let json = webStorage.getItem(cacheKey, storage);
        let data = trmrk.core.tryParseJson(json);

        let apiResult = new TrmrkAxiosApiResult();

        if (!trmrk.core.isNullOrUndef(data)) {
            apiResult = {
                isSuccess: true,
                data: data
            }
        } else {
            apiResult = await axiosReqFunc();

            if (apiResult.isSuccess) {
                if (!trmrk.core.isNullOrUndefOrOrNaN(apiResult.data)) {
                    json = JSON.stringify(apiResult.data);
                    webStorage.setItem(cacheKey, storage);
                }
            }
        }

        return apiResult;
    }

    async get(url, params, cacheKey, storage) {
        let apiResult = this.request(
            () => trmrkAxios.get(url, params),
            cacheKey, storage);

        return apiResult;
    }
}

trmrk.types["WebStorageAxios"] = WebStorageAxios;

const webStorageAxiosInstn = new WebStorageAxios();
export const webStorageAxios = webStorageAxiosInstn;