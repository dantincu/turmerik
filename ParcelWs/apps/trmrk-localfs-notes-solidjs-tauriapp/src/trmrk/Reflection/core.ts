export const getPropName = <T>(propNameFunc: (obj: T) => any) =>
  propNameFunc
    .toString()
    .split('>')[1]
    ?.trim()
    .split('.')
    .slice(1)
    .map((part) => part.trim())
    .join('.');

export const propName = <T>(_: T, propNameFunc: (obj: T) => any) =>
  getPropName(propNameFunc);

export const nameOf = <T>(_: () => T, propNameFunc: (obj: T) => any) =>
  getPropName(propNameFunc);
