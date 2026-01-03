const trmrkRef = {};
const createTrmrkFunc = (appName, createGlobalTrmrkObj = false) => {
    const trmrk = (trmrkRef.value = createGlobalTrmrkObj
        ? (globalThis.trmrk ??= {})
        : {});
    trmrk.appName = appName;
    trmrk.dbObjNamePrefix = `[${appName}]`;
    return trmrk;
};
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
