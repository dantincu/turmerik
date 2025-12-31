const trmrkGlobalObjName = 'trmrk';
const turmerikRepoUrl = 'https://github.com/dantincu/turmerik';
const globalThisAsAny = globalThis;
const isTrmrkObj = (trmrkObj) => 'object' === typeof trmrkObj && trmrkObj?.turmerikRepoUrl === turmerikRepoUrl;
const dfTrmrkObjVal = () => null;
let trmrkObj = globalThisAsAny[trmrkGlobalObjName];
if (!isTrmrkObj(trmrkObj)) {
    trmrkObj = globalThisAsAny[turmerikRepoUrl];
    if (!isTrmrkObj(trmrkObj)) {
        trmrkObj = dfTrmrkObjVal();
        for (let globalVar in globalThis) {
            if ('string' === typeof globalVar &&
                globalVar.startsWith(`[${turmerikRepoUrl}]`) &&
                /\[\d+\]/.test(globalVar.substring(turmerikRepoUrl.length + 2))) {
                trmrkObj = globalThisAsAny[globalVar];
                if (!isTrmrkObj(trmrkObj)) {
                    trmrkObj = dfTrmrkObjVal();
                }
                else {
                    break;
                }
            }
        }
    }
}
export const trmrk = trmrkObj;
