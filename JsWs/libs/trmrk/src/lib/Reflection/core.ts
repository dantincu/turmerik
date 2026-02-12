export const getPropName = (propNameFunc: ((obj: any) => any) | (() => any)) =>
  propNameFunc
    .toString()
    .split(">")[1]
    ?.trim()
    .split(".")
    .slice(1)
    .map((part) => part.trim())
    .join(".");

export const propName = <T>(_: T, propNameFunc: (obj: T) => any) =>
  getPropName(propNameFunc);

export const nameOf = <T>(_: () => T, propNameFunc: (obj: T) => any) =>
  getPropName(propNameFunc);

// export const getVarName = (varNameFunc: () => any) => varNameFunc.toString().split('>')[1]?.trim();

export const namesOf = <T>(
  dummyObjFactory: () => T,
  propNameFuncs: ((obj: T) => any)[],
) => propNameFuncs.map((propNameFunc) => nameOf(dummyObjFactory, propNameFunc));
