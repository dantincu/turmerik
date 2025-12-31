import { TrmrkGlobalObjCore } from './trmrk-global-obj-def';

const trmrkGlobalObjName = 'trmrk';
const turmerikRepoUrl = 'https://github.com/dantincu/turmerik';

const trmrk = {
  turmerikRepoUrl,
} as TrmrkGlobalObjCore;

const globalThisAsAny = globalThis as any;

if ('undefined' !== typeof globalThisAsAny[trmrkGlobalObjName]) {
  if ('undefined' !== typeof globalThisAsAny[turmerikRepoUrl]) {
    const generateTrmrkGlobalObjName = () => `[${trmrk.turmerikRepoUrl}][${new Date().getTime()}]`;
    let trmrkGlobalObjName = generateTrmrkGlobalObjName();

    while ('undefined' !== typeof globalThisAsAny[trmrkGlobalObjName]) {
      trmrkGlobalObjName = generateTrmrkGlobalObjName();
    }

    globalThisAsAny[trmrkGlobalObjName] = trmrk;
  } else {
    globalThisAsAny[trmrk.turmerikRepoUrl] = trmrk;
  }
} else {
  globalThisAsAny[trmrkGlobalObjName] = trmrk;
}
