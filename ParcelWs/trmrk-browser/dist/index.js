
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $9796f6cdfe559cd8$exports = {};

$parcel$export($9796f6cdfe559cd8$exports, "axiosIdxedDB", () => $9796f6cdfe559cd8$export$3359cb3a5bf46c9b);
var $b098f0dc9c680699$exports = {};

$parcel$export($b098f0dc9c680699$exports, "AxiosIdxedDB", () => $b098f0dc9c680699$export$f31ab75d36c3dd66);
class $b098f0dc9c680699$export$f31ab75d36c3dd66 {
    constructor(apiSvc, idxedDB){
        this.apiSvc = apiSvc;
        this.idxedDB = idxedDB;
    }
    init(opts) {
        this.apiSvc.init(opts.data, opts.defaultConfigFactory);
        return this.idxedDB.init(opts);
    }
    async req(opts) {
        let resp = await this.idxedDB.withDb(opts.idxedDBGet);
        if (!(resp.cacheMatch || resp.cacheError)) {
            resp = await opts.apiCall(this.apiSvc);
            if (resp.isSuccessStatus) await this.idxedDB.withDb((db)=>{
                const setResp = opts.idxedDBSet(db, resp.data);
                resp.cacheError = setResp.cacheError;
                return setResp;
            });
        }
        return resp;
    }
}


const $9796f6cdfe559cd8$export$3359cb3a5bf46c9b = {
    ...$b098f0dc9c680699$exports
};


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
        }
        return resp;
    }
}


const $0ce88b97e07ed324$export$f8d9e511b6d09b2e = {
    ...$4471f3cb84ebff95$exports
};


const $149c1bd638913645$export$3f2684e5d7cb1006 = {
    axiosIdxedDB: $9796f6cdfe559cd8$exports,
    axiosLocalForage: $0ce88b97e07ed324$exports
};


export {$149c1bd638913645$export$3f2684e5d7cb1006 as browser};
//# sourceMappingURL=index.js.map
