import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
  Provider,
  EnvironmentProviders,
  Type,
  NgZoneOptions,
  provideAppInitializer,
  inject,
} from '@angular/core';

import { provideRouter, Route } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';

import { AppServiceBase } from '../common/app-service-base';
import { AppStateServiceBase } from '../common/app-state-service-base';
import { IntIdServiceFactory } from '../common/int-id-service-factory';

import { NullOrUndef } from '../../../trmrk/core';
import { AsyncRequestStateManagerFactory } from '../../../trmrk/AsyncRequestStateManager';
import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';
import { loadAppConfig, LoadAppConfigOpts } from '../common/app-config-loader';
import { AppConfigCore } from '../common/app-config';
import { DarkModeService } from '../common/dark-mode-service';
import { TrmrkObservable } from '../common/TrmrkObservable';

import { injectionTokens } from './injection-tokens';

export interface ServiceProviderOpts<TOpts> {
  provide?: boolean | NullOrUndef;
  opts?: TOpts | NullOrUndef;
}

export interface GetCommonServiceProviderOpts<TAppConfig extends AppConfigCore = AppConfigCore> {
  browserGlobalErrorListeners?: boolean | NullOrUndef;
  zoneChangeDetection?: ServiceProviderOpts<NgZoneOptions>;
  httpClient?: boolean | NullOrUndef;
  matDialogModule?: boolean | NullOrUndef;

  appConfig?: LoadAppConfigOpts<TAppConfig> | NullOrUndef;
  appServiceType?: Type<any> | NullOrUndef;
  appStateServiceType?: Type<any> | NullOrUndef;
  basicAppSettingsIDbAdapter?: (() => BasicAppSettingsDbAdapter) | NullOrUndef;
  asyncRequestStateManagerFactory?: boolean | NullOrUndef;
  intIdServiceFactory?: boolean | NullOrUndef;
  darkModeAppInitializer?: boolean | NullOrUndef;
}

export interface GetCommonServiceProvidersArgs<TAppConfig extends AppConfigCore = AppConfigCore> {
  envName?: string | NullOrUndef;
  isProdEnv: boolean;
  appName: string;
  provide: GetCommonServiceProviderOpts<TAppConfig>;
  routes?: Route[];
  appProviders: (Provider | EnvironmentProviders | null)[];
}

export const defaultConfigNormalizeFactory = async <TConfig extends AppConfigCore = AppConfigCore>(
  appConfig: TConfig
) => {
  appConfig.isWebApp ??= true;
  appConfig.routeBasePath ??= '/app';
  appConfig.requiresSetup ??= false;
  appConfig.listDefaultPageSize ??= 50;
  appConfig.maxSimultaneousRequestsCount ??= 4;
  appConfig.cacheValidIntervalMillis ??= 0;
  return appConfig;
};

export class AppConfigProvidersFactory<TAppConfig extends AppConfigCore = AppConfigCore> {
  appConfig = new TrmrkObservable<TAppConfig>(null!);

  getProviders(
    opts: LoadAppConfigOpts<TAppConfig>,
    envName: string,
    isProdEnv: boolean,
    appName: string
  ): (Provider | EnvironmentProviders)[] {
    return [
      provideAppInitializer(async () => {
        let appConfig =
          opts.values ?? (await loadAppConfig<TAppConfig>(inject(HttpClient), opts, envName));

        appConfig.isProdEnv = isProdEnv;
        appConfig.appName ??= appName;

        if (opts.configNormalizeFactory) {
          appConfig = await opts.configNormalizeFactory(appConfig);
        }

        if (opts.applyConfigDefaults ?? true) {
          appConfig = await defaultConfigNormalizeFactory(appConfig);
        }

        this.appConfig.next(appConfig);
      }),
      {
        provide: injectionTokens.appName.token,
        useValue: appName,
      },
      {
        provide: injectionTokens.appConfig.token,
        useFactory: () => {
          return this.appConfig;
        },
      },
    ];
  }
}

export const getDarkModeAppInitializer = () =>
  provideAppInitializer(() => {
    const darkModeService = inject(DarkModeService);
    darkModeService.init();
  });

export const getServiceProviders = <TAppConfig extends AppConfigCore = AppConfigCore>(
  args: GetCommonServiceProvidersArgs<TAppConfig>
) => {
  const opts = args.provide;

  const providersArr: (Provider | EnvironmentProviders | null)[] = [
    opts.browserGlobalErrorListeners ?? true ? provideBrowserGlobalErrorListeners() : null,

    opts.zoneChangeDetection?.provide
      ? provideZoneChangeDetection(opts.zoneChangeDetection.opts ?? {})
      : null,

    opts.httpClient ?? true ? provideHttpClient() : null,

    opts.matDialogModule ?? true ? importProvidersFrom(MatDialogModule) : null,

    ...(opts.appConfig?.provide ?? true
      ? new AppConfigProvidersFactory<TAppConfig>().getProviders(
          opts.appConfig ?? {
            values: {} as TAppConfig,
          },
          args.envName ?? 'env',
          args.isProdEnv,
          args.appName
        )
      : []),

    opts.appServiceType ? { provide: AppServiceBase, useClass: opts.appServiceType } : null,

    opts.appStateServiceType
      ? { provide: AppStateServiceBase, useClass: opts.appStateServiceType }
      : null,

    opts.basicAppSettingsIDbAdapter
      ? {
          provide: injectionTokens.basicAppSettingsDbAdapter.token,
          useFactory: opts.basicAppSettingsIDbAdapter,
        }
      : null,

    opts.asyncRequestStateManagerFactory ?? true
      ? { provide: AsyncRequestStateManagerFactory }
      : null,

    opts.intIdServiceFactory ?? true
      ? {
          provide: injectionTokens.intIdServiceFactory,
          useClass: IntIdServiceFactory,
        }
      : null,

    opts.darkModeAppInitializer ?? true ? getDarkModeAppInitializer() : null,

    args.routes ? provideRouter(args.routes) : null,
    ...args.appProviders,
  ];

  const retArr: (Provider | EnvironmentProviders)[] = providersArr.filter(
    (provider) => provider
  ) as (Provider | EnvironmentProviders)[];

  return retArr;
};
