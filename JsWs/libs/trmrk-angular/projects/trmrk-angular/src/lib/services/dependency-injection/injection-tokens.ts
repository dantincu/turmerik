import { InjectionToken } from '@angular/core';

import { mapObjProps } from '../../../trmrk/obj';

import { IntIdServiceFactory } from '../common/int-id-service-factory';
import { NgAppConfigCore } from '../common/app-config';
import { TrmrkObservable } from '../common/TrmrkObservable';
import { TrmrkUrlNormalizerBase } from '../common/trmrk-url-normalizer-base';

export interface InjectionTokenWrapper<T> {
  name: string;
  token: InjectionToken<T>;
}

export const injectionTokens = mapObjProps(
  {
    intIdServiceFactory: {} as InjectionTokenWrapper<IntIdServiceFactory>,
    appConfig: {} as InjectionTokenWrapper<TrmrkObservable<NgAppConfigCore>>,
    appName: {} as InjectionTokenWrapper<string>,
  },
  (_, propName): InjectionTokenWrapper<any> => ({
    name: propName,
    token: new InjectionToken<any>(propName),
  })
);
