import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
  Provider,
  EnvironmentProviders,
  Type,
  NgZoneOptions,
} from '@angular/core';

import { provideRouter, Route } from '@angular/router';

import { MatDialogModule } from '@angular/material/dialog';

import { AppStateServiceBase } from '../common/app-state-service-base';
import { AppConfigServiceBase } from '../common/app-config-service-base';
import { IntIdServiceFactory } from '../common/int-id-service-factory';

import { NullOrUndef } from '../../../trmrk/core';
import { AsyncRequestStateManagerFactory } from '../../../trmrk/AsyncRequestStateManager';
import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { injectionTokens } from './injection-tokens';

export interface ServiceProviderOpts<TOpts> {
  provide?: boolean | NullOrUndef;
  opts?: TOpts | NullOrUndef;
}

export interface GetCommonServiceProvidersArgs {
  provideBrowserGlobalErrorListeners?: boolean | NullOrUndef;
  provideZoneChangeDetection?: ServiceProviderOpts<NgZoneOptions>;
  provideMatDialogModule?: boolean | NullOrUndef;
  AppStateServiceType?: Type<any> | NullOrUndef;
  AppConfigServiceType?: Type<any> | NullOrUndef;
  basicAppSettingsIDbAdapter?: BasicAppSettingsDbAdapter | NullOrUndef;
  provideAsyncRequestStateManagerFactory?: boolean | NullOrUndef;
  provideIntIdServiceFactory?: boolean | NullOrUndef;
  routes?: Route[];
  appProviders: (Provider | EnvironmentProviders | null)[];
}

export const getServiceProviders = (args: GetCommonServiceProvidersArgs) => {
  const providersArr: (Provider | EnvironmentProviders | null)[] = [
    args.provideBrowserGlobalErrorListeners ?? true ? provideBrowserGlobalErrorListeners() : null,

    args.provideZoneChangeDetection?.provide
      ? provideZoneChangeDetection(args.provideZoneChangeDetection.opts ?? {})
      : null,

    args.provideMatDialogModule ?? true ? importProvidersFrom(MatDialogModule) : null,

    args.AppStateServiceType
      ? { provide: AppStateServiceBase, useClass: args.AppStateServiceType }
      : null,

    args.AppConfigServiceType
      ? { provide: AppConfigServiceBase, useClass: args.AppConfigServiceType }
      : null,

    args.basicAppSettingsIDbAdapter
      ? {
          provide: injectionTokens.basicAppSettingsDbAdapter.token,
          useValue: args.basicAppSettingsIDbAdapter,
        }
      : null,

    args.provideAsyncRequestStateManagerFactory ?? true
      ? { provide: AsyncRequestStateManagerFactory }
      : null,

    args.provideIntIdServiceFactory ?? true
      ? {
          provide: injectionTokens.intIdServiceFactory,
          useClass: IntIdServiceFactory,
        }
      : null,

    args.routes ? provideRouter(args.routes) : null,
    ...args.appProviders,
  ];

  const retArr: (Provider | EnvironmentProviders)[] = providersArr.filter(
    (provider) => provider
  ) as (Provider | EnvironmentProviders)[];

  return retArr;
};
