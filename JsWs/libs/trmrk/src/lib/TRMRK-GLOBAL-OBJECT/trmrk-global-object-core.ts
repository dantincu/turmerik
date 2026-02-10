interface TrmrkGlobalObjectCoreIntf {
  appName: string;
  dbObjAppName: string;
}

const trmrkRef = {} as { value: TrmrkGlobalObjectCoreIntf };

const createTrmrkFunc = <TObject extends TrmrkGlobalObjectCoreIntf>(
  appName: string,
  dbObjAppName?: string | null | undefined,
  createGlobalTrmrkObj?: boolean | null | undefined,
) => {
  const trmrk = (trmrkRef.value = createGlobalTrmrkObj
    ? ((globalThis as any).trmrk ??= {})
    : {}) as TObject;

  trmrk.appName = appName;
  trmrk.dbObjAppName = dbObjAppName ?? appName;
  return trmrk;
};

export type TrmrkGlobalObjectCore = TrmrkGlobalObjectCoreIntf;
export const getTrmrk = () => trmrkRef.value;
export const createTrmrk = createTrmrkFunc;
