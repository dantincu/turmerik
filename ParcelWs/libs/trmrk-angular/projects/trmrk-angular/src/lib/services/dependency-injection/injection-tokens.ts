import { InjectionToken } from '@angular/core';

import { mapObjProps } from '../../../trmrk/obj';

import { IntIdServiceFactory } from '../common/int-id-service-factory';
import { TrmrkStrIdGeneratorBase } from '../common/trmrk-str-id-generator-base';
import { AppConfigCore } from '../common/app-config';
import { TrmrkObservable } from '../common/TrmrkObservable';

export interface InjectionTokenWrapper<T> {
  name: string;
  token: InjectionToken<T>;
}

export const injectionTokens = mapObjProps(
  {
    intIdServiceFactory: {} as InjectionTokenWrapper<IntIdServiceFactory>,
    appConfig: {} as InjectionTokenWrapper<TrmrkObservable<AppConfigCore>>,
    appName: {} as InjectionTokenWrapper<string>,
    strIdGenerator: {} as InjectionTokenWrapper<TrmrkStrIdGeneratorBase>,
  },
  (_, propName): InjectionTokenWrapper<any> => ({
    name: propName,
    token: new InjectionToken<any>(propName),
  })
);
