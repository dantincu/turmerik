interface TrmrkGlobalObjectCoreIntf {
  appName: string;
  dbObjNamePrefix: string;
}

const trmrkRef = {} as { value: TrmrkGlobalObjectCoreIntf };

const createTrmrkFunc = <TObject extends TrmrkGlobalObjectCoreIntf>(
  appName: string,
  createGlobalTrmrkObj?: boolean | null | undefined,
) => {
  const trmrk = (trmrkRef.value = createGlobalTrmrkObj
    ? ((globalThis as any).trmrk ??= {})
    : {}) as TObject;

  trmrk.appName = appName;
  trmrk.dbObjNamePrefix = `[${appName}]`;
  return trmrk;
};

export type TrmrkGlobalObjectCore = TrmrkGlobalObjectCoreIntf;
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
