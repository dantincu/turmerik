
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $0ce88b97e07ed324$exports = {};

$parcel$export($0ce88b97e07ed324$exports, "axiosLocalForage", () => $0ce88b97e07ed324$export$f8d9e511b6d09b2e);
var $4471f3cb84ebff95$exports = {};

$parcel$export($4471f3cb84ebff95$exports, "AxiosLocalForage", () => $4471f3cb84ebff95$export$9d2f0cbd0517306d);
class $4471f3cb84ebff95$export$9d2f0cbd0517306d {
    constructor(apiSvc){
        this.apiSvc = apiSvc;
    }
    init(opts) {
        this.apiSvc.init(opts.data, opts.defaultConfigFactory);
    }
    async req(opts) {
        let resp = await opts.localForageGet();
        if (!resp.cacheMatch) {
            resp = await opts.apiCall(this.apiSvc);
            if (resp.isSuccessStatus) {
                const setResp = await opts.localForageSet(resp.data);
                resp.cacheError = setResp.cacheError;
            }
        } else resp.isSuccessStatus = true;
        return resp;
    }
}


const $0ce88b97e07ed324$export$f8d9e511b6d09b2e = {
    ...$4471f3cb84ebff95$exports
};


const $149c1bd638913645$export$3f2684e5d7cb1006 = {
    axiosLocalForage: $0ce88b97e07ed324$exports
};


export {$149c1bd638913645$export$3f2684e5d7cb1006 as browser};
//# sourceMappingURL=index.js.map
