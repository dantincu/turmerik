const trmrkGlobalObjName = 'trmrk';
const turmerikRepoUrl = 'https://github.com/dantincu/turmerik';
const trmrk = {
    turmerikRepoUrl,
};
const globalThisAsAny = globalThis;
if ('undefined' !== typeof globalThisAsAny[trmrkGlobalObjName]) {
    if ('undefined' !== typeof globalThisAsAny[turmerikRepoUrl]) {
        const generateTrmrkGlobalObjName = () => `[${trmrk.turmerikRepoUrl}][${new Date().getTime()}]`;
        let trmrkGlobalObjName = generateTrmrkGlobalObjName();
        while ('undefined' !== typeof globalThisAsAny[trmrkGlobalObjName]) {
            trmrkGlobalObjName = generateTrmrkGlobalObjName();
        }
        globalThisAsAny[trmrkGlobalObjName] = trmrk;
    }
    else {
        globalThisAsAny[trmrk.turmerikRepoUrl] = trmrk;
    }
}
else {
    globalThisAsAny[trmrkGlobalObjName] = trmrk;
}
export {};
