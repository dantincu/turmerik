import { InjectionToken } from '@angular/core';

import { mapObjProps } from '../../../trmrk/obj';

export interface InjectionTokenWrapper {
  name: string;
  token: InjectionToken<any>;
}

export const injectionTokens = mapObjProps(
  {
    basicAppSettingsDbAdapter: {} as InjectionTokenWrapper,
    intIdServiceFactory: {} as InjectionTokenWrapper,
  },
  (_, propName): InjectionTokenWrapper => ({
    name: propName,
    token: new InjectionToken<any>(propName),
  })
);
