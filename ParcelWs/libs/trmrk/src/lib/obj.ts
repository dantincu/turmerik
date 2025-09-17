import { NullOrUndef } from './core';

/**
 * taken from https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
 **/
export const proxiedPropsOf = <TObj>(obj?: TObj) => {
  return new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error('Set not supported');
      },
    }
  ) as {
    [P in keyof TObj]?: P;
  };
};

export const propOf = <TObj>(name: keyof TObj) => {
  return name;
};

export const propsOf = <TObj>(_obj: TObj | undefined = undefined) => {
  const result = <T extends keyof TObj>(name: T) => {
    return name;
  };

  return result;
};

export const isNotNullObj = (arg: any) => {
  let retVal = 'object' === typeof arg;
  retVal = retVal && arg !== null;

  return retVal;
};

export const forEachProp = <TObj extends Object>(
  obj: TObj,
  callback: (
    propVal: any,
    propName: string,
    objMap: { [key: string]: any },
    objPropNames: string[],
    obj: TObj
  ) => void
) => {
  const objMap = obj as { [key: string]: any };
  const objPropNames = Object.getOwnPropertyNames(obj);

  for (let propName of objPropNames) {
    const propVal = objMap[propName];
    callback(propVal, propName, objMap, objPropNames, obj);
  }

  return obj;
};

export const merge = <TTrgObj extends Object>(
  trgObj: TTrgObj,
  srcObjsArr: Object[],
  depth: number | NullOrUndef = 0,
  mergeOverwrite = false
) => {
  depth ??= Number.MAX_VALUE;
  const trgObjMap = trgObj as { [key: string]: any };

  for (let srcObj of srcObjsArr) {
    const srcObjMap = srcObj as { [key: string]: any };
    for (let propName of Object.getOwnPropertyNames(srcObj)) {
      const srcPropVal = srcObjMap[propName];
      const trgPropVal = trgObjMap[propName];

      if ((srcPropVal ?? null) !== null) {
        if ((trgPropVal ?? null) === null) {
          trgObjMap[propName] = srcPropVal;
        } else if (
          depth > 0 &&
          typeof trgObjMap[propName] === 'object' &&
          typeof srcPropVal === 'object'
        ) {
          merge(trgObj, [srcObj], depth - 1, mergeOverwrite);
        } else if (mergeOverwrite) {
          trgObjMap[propName] = srcPropVal;
        }
      }
    }
  }

  return trgObj;
};

export const mapObjProps = <TObj extends Object>(
  obj: TObj,
  propValFactory: (
    propVal: any,
    propName: string,
    objMap: { [key: string]: any },
    objPropNames: string[],
    obj: TObj
  ) => any
) =>
  forEachProp(obj, (propVal, propName, objMap, objPropNames, obj) => {
    objMap[propName] = propValFactory(propVal, propName, objMap, objPropNames, obj);
  });
