const trmrkRef = {};
const createTrmrkFunc = (appName, createGlobalTrmrkObj, dbObjNamePrefix) => {
    const trmrk = (trmrkRef.value = createGlobalTrmrkObj
        ? (globalThis.trmrk ??= {})
        : {});
    trmrk.appName = appName;
    trmrk.dbObjNamePrefix = dbObjNamePrefix ?? `[${appName}]`;
    return trmrk;
};
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
