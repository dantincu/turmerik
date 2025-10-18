import { InjectionToken } from '@angular/core';

import { mapObjProps } from '../../../trmrk/obj';
import { InjectionTokenWrapper } from '../../../trmrk-angular/services/dependency-injection/injection-tokens';

export const fileManagerInjectionTokens = mapObjProps(
  {},
  (_, propName): InjectionTokenWrapper<any> => ({
    name: propName,
    token: new InjectionToken<any>(propName),
  })
);
