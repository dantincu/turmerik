import $hgUW1$axios from "axios";


var $8a29e9b0d3dc349c$export$76f050bd65425e13;
(function(ns) {
    ns.trmrkHeaderNames = {
        clientVersion: "trmrk-client-version",
        clientUserUuid: "trmrk-client-user-uuid",
        requiredClientVersion: "trmrk-required-client-version"
    };
    class ApiService {
        init(data, defaultConfigFactory) {
            this.apiHost = data.apiHost;
            this.apiRelUriBase = data.apiRelUriBase;
            this.apiUriBase = [
                this.apiHost,
                this.apiRelUriBase
            ].join("/");
            this.clientVersion = data.clientVersion;
            this.defaultConfigFactory = defaultConfigFactory ?? ((data)=>{
                const headers = {};
                headers[ns.trmrkHeaderNames.clientVersion] = this.clientVersion.toString();
                headers[ns.trmrkHeaderNames.clientUserUuid] = this.clientUserUuid;
                return {
                    withCredentials: true,
                    headers: headers
                };
            });
        }
        getUri(relUri) {
            const uri = [
                this.apiUriBase,
                relUri
            ].join("/");
            return uri;
        }
        getError(reason) {
            const resp = {
                error: reason,
                errTitle: "Error",
                errMessage: reason.message ?? "Oops... something went wrong"
            };
            return resp;
        }
        resolvePromise(prom, resolve) {
            prom.then((response)=>{
                const resp = this.setResponseFields(response);
                resolve(resp);
            }).catch((reason)=>{
                let resp;
                const response = reason.response;
                if (response) resp = this.setResponseFields(response);
                else resp = this.getError(reason);
                resolve(resp);
            });
        }
        setResponseFields(resp) {
            const status = resp.status;
            if (status >= 100) {
                if (status < 200) resp.isInfoStatus = true;
                else if (status < 300) resp.isSuccessStatus = true;
                else if (status < 400) resp.isRedirectStatus = false;
                else {
                    resp.isErrorStatus = false;
                    if (status < 500) {
                        resp.isClientErrorStatus = true;
                        switch(status){
                            case 400:
                                resp.errMessage = "A validation error has occurred";
                                resp.isBadRequestStatus = true;
                                break;
                            case 401:
                                resp.errMessage = "You are not authenticated";
                                resp.isNotAuthenticatedStatus = true;
                                break;
                            case 403:
                                resp.errMessage = "You are not authorized to access this page";
                                resp.isForbiddenStatus = true;
                                break;
                            case 404:
                                resp.errMessage = "The page you are looking for doesn't exist or has been moved";
                                resp.isNotFoundStatus = true;
                                break;
                            case 408:
                                resp.errMessage = "The request took too long to respond";
                                resp.isTimeoutStatus = true;
                                break;
                            case 428:
                                resp.isPreconditionRequiredStatus = true;
                                if (ns.trmrkHeaderNames.requiredClientVersion in resp.headers) resp.errMessage = `The client app in the browser needs to be updated. \
                  Please back up any unsubmitted data (if any) and then refresh the browser page in order to update the client app.`;
                        }
                    } else resp.isServerErrorStatus = true;
                }
            }
            if (!resp.isSuccessStatus) {
                if (!!status) resp.errTitle = status.toString();
                else resp.errTitle = "Error";
                resp.errMessage ??= `The server responded with status ${status}`;
            }
            return resp;
        }
        get(relUri, data, configFactory) {
            return new Promise((resolve)=>{
                this.resolvePromise((0, $hgUW1$axios).get(this.getUri(relUri), this.getConfig(configFactory, data)), resolve);
            });
        }
        post(relUri, data, configFactory) {
            return new Promise((resolve)=>{
                this.resolvePromise((0, $hgUW1$axios).post(this.getUri(relUri), data, this.getConfig(configFactory, data)), resolve);
            });
        }
        put(relUri, data, configFactory) {
            return new Promise((resolve)=>{
                this.resolvePromise((0, $hgUW1$axios).put(this.getUri(relUri), data, this.getConfig(configFactory, data)), resolve);
            });
        }
        patch(relUri, data, configFactory) {
            return new Promise((resolve)=>{
                this.resolvePromise((0, $hgUW1$axios).patch(this.getUri(relUri), data, this.getConfig(configFactory, data)), resolve);
            });
        }
        delete(relUri, configFactory) {
            return new Promise((resolve)=>{
                this.resolvePromise((0, $hgUW1$axios).delete(this.getUri(relUri), this.getConfig(configFactory)), resolve);
            });
        }
        getConfig(configFactory, data) {
            let config = this.defaultConfigFactory(data);
            configFactory ??= (dt, cfg)=>{
                if (cfg && (dt ?? false)) cfg.data ??= dt;
                return cfg;
            };
            config = configFactory(data, config);
            return config;
        }
        constructor(){
            this.defaultConfigFactory = ()=>undefined;
        }
    }
    ns.ApiService = ApiService;
})($8a29e9b0d3dc349c$export$76f050bd65425e13 || ($8a29e9b0d3dc349c$export$76f050bd65425e13 = {}));
const $8a29e9b0d3dc349c$export$ae14c375fc93363 = $8a29e9b0d3dc349c$export$76f050bd65425e13.ApiService;


const $149c1bd638913645$export$ae14c375fc93363 = $8a29e9b0d3dc349c$export$ae14c375fc93363;


export {$149c1bd638913645$export$ae14c375fc93363 as ApiService};
//# sourceMappingURL=index.js.map
