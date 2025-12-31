import { TrmrkGlobalObjCore } from './trmrk-global-obj-def';

const trmrkGlobalObjName = 'trmrk';
const turmerikRepoUrl = 'https://github.com/dantincu/turmerik';
const globalThisAsAny = globalThis as any;

const isTrmrkObj = (trmrkObj: TrmrkGlobalObjCore) =>
  'object' === typeof trmrkObj && trmrkObj?.turmerikRepoUrl === turmerikRepoUrl;

const dfTrmrkObjVal = () => null as unknown as TrmrkGlobalObjCore;
let trmrkObj: TrmrkGlobalObjCore = globalThisAsAny[trmrkGlobalObjName];

if (!isTrmrkObj(trmrkObj)) {
  trmrkObj = globalThisAsAny[turmerikRepoUrl] as TrmrkGlobalObjCore;

  if (!isTrmrkObj(trmrkObj)) {
    trmrkObj = dfTrmrkObjVal();

    for (let globalVar in globalThis) {
      if (
        'string' === typeof globalVar &&
        globalVar.startsWith(`[${turmerikRepoUrl}]`) &&
        /\[\d+\]/.test(globalVar.substring(turmerikRepoUrl.length + 2))
      ) {
        trmrkObj = globalThisAsAny[globalVar];

        if (!isTrmrkObj(trmrkObj)) {
          trmrkObj = dfTrmrkObjVal();
        } else {
          break;
        }
      }
    }
  }
}

export const trmrk = trmrkObj;
