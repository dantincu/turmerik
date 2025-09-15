import { MtblRefValue } from './core';

export const isDevEnv: MtblRefValue<boolean | null> = {
  value: null,
};

export const awaitTimeout = (millisToWait: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), millisToWait));
