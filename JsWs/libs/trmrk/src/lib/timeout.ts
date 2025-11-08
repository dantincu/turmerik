import { AnyOrUnknown, NullOrUndef } from './core';

export const timeoutToPromise = (delay: number) =>
  new Promise<NodeJS.Timeout>((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(timeoutId);
    }, delay);
  });

export const awaitTimeout = <T = AnyOrUnknown>(
  callback: (id: NodeJS.Timeout) => T,
  delay?: number | NullOrUndef
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
