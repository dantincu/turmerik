import { AnyOrUnknown, NullOrUndef, MtblRefValue, actWithIf } from "./core";

export const clearTimeouIfReqCore = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | NullOrUndef,
  clearFunc: (timeoutId: NodeJS.Timeout) => void,
) =>
  actWithIf(timeoutIdRef?.value, (timeoutId) => {
    clearFunc(timeoutId);
    timeoutIdRef!.value = null;
  });

export const clearTimeoutIfReq = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | NullOrUndef,
) => clearTimeouIfReqCore(timeoutIdRef, (id) => clearTimeout(id));

export const clearIntervalIfReq = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | NullOrUndef,
) => clearTimeouIfReqCore(timeoutIdRef, (id) => clearInterval(id));

export const clearTmOutIfReq = (timeoutId: NodeJS.Timeout | NullOrUndef) =>
  actWithIf(timeoutId, (id) => clearTimeout(id));

export const clearIntvIfReq = (timeoutId: NodeJS.Timeout | NullOrUndef) =>
  actWithIf(timeoutId, (id) => clearInterval(id));

export const timeoutToPromise = (delay: number) =>
  new Promise<NodeJS.Timeout>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(timeoutId);
    }, delay);
  });

export const awaitTimeout = <T = AnyOrUnknown>(
  callback: (id: NodeJS.Timeout) => T,
  delay?: number | NullOrUndef,
) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      try {
        resolve(callback(timeoutId));
      } catch (err) {
        reject(err);
      }
    }, delay ?? undefined);
  });
