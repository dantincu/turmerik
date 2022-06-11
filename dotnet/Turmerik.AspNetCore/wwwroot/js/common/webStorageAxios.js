import { trmrk } from './core.js';
import { ViewModelBase } from './ViewModelBase.js';
import { trmrkAxios, TrmrkAxiosApiResult } from './trmrkAxios.js';
import { webStorage } from './webStorage.js';

export class WebStorageAxios {
    async request(axiosReqFunc, cacheKey, storage, refreshCache) {
        let json = "";
        let data;

        if (!refreshCache) {
            json = webStorage.getItem(cacheKey, storage);
            data = trmrk.core.tryParseJson(json);
        }

        let apiResult = new TrmrkAxiosApiResult();
        let cachedDataFound = false;

        if (!trmrk.core.isNullOrUndef(data)) {
            cachedDataFound = true;

            apiResult = {
                isSuccess: true,
                data: data
            }
        } else {
            apiResult = await axiosReqFunc();

            if (apiResult.isSuccess) {
                if (!cachedDataFound && !trmrk.core.isNullOrUndefOrOrNaN(apiResult.data)) {
                    json = JSON.stringify(apiResult.data);
                    webStorage.setItem(cacheKey, json, storage);
                }
            }
        }

        return apiResult;
    }

    async get(url, cacheKey, storage, opts, refreshCache) {
        let apiResult = this.request(
            () => trmrkAxios.get(url, opts),
            cacheKey, storage, refreshCache);

        return apiResult;
    }
}

trmrk.types["WebStorageAxios"] = WebStorageAxios;

const webStorageAxiosInstn = new WebStorageAxios();
export const webStorageAxios = webStorageAxiosInstn;