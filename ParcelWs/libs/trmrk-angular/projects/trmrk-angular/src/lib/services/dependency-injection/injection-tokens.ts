import { InjectionToken } from '@angular/core';

import { mapObjProps } from '../../../trmrk/obj';
import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { IntIdServiceFactory } from '../common/int-id-service-factory';
import { AppConfigCore } from '../common/app-config';
import { TrmrkObservable } from '../common/TrmrkObservable';

export interface InjectionTokenWrapper<T> {
  name: string;
  token: InjectionToken<T>;
}

export const injectionTokens = mapObjProps(
  {
    basicAppSettingsDbAdapter: {} as InjectionTokenWrapper<BasicAppSettingsDbAdapter>,
    intIdServiceFactory: {} as InjectionTokenWrapper<IntIdServiceFactory>,
    appConfig: {} as InjectionTokenWrapper<TrmrkObservable<AppConfigCore>>,
    appName: {} as InjectionTokenWrapper<string>,
  },
  (_, propName): InjectionTokenWrapper<any> => ({
    name: propName,
    token: new InjectionToken<any>(propName),
  })
);
