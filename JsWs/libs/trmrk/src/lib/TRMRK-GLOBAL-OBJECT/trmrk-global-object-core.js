const trmrkRef = {};
const createTrmrkFunc = (appName, dbObjAppName, createGlobalTrmrkObj) => {
    const trmrk = (trmrkRef.value = createGlobalTrmrkObj
        ? (globalThis.trmrk ??= {})
        : {});
    trmrk.appName = appName;
    trmrk.dbObjAppName = dbObjAppName ?? appName;
    return trmrk;
};
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
