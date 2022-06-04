import { trmrk, domUtils, bsDomUtils, vdom, webStorage } from './common/main.js';

export class App {
    init() {
        let urlQuery = trmrk.core.urlQuery;
        let edit = urlQuery.get("edit") === "true";

        if (edit) {
            
        } else {

        }
    }
}

const appInstn = new App();
export const app = appInstn;
