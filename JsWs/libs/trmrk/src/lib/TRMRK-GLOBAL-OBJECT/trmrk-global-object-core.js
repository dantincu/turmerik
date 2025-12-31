const trmrkRef = {};
const createTrmrkFunc = (appName) => {
    const trmrk = (trmrkRef.value = globalThis.trmrk ??= {});
    trmrk.appName = appName;
    trmrk.dbObjNamePrefix = `[${appName}]`;
    return trmrk;
};
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
