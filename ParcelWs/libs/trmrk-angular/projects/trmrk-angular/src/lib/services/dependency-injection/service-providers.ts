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

import { AppStateServiceBase } from '../common/app-state-service-base';
import { IntIdServiceFactory } from '../common/int-id-service-factory';

import { NullOrUndef } from '../../../trmrk/core';
import { AsyncRequestStateManagerFactory } from '../../../trmrk/AsyncRequestStateManager';
import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';
import { loadAppConfig, LoadAppConfigOpts } from '../common/app-config-loader';
import { AppConfigCore } from '../common/app-config';
import { DarkModeService } from '../common/dark-mode-service';

import { injectionTokens } from './injection-tokens';

export interface ServiceProviderOpts<TOpts> {
  provide?: boolean | NullOrUndef;
  opts?: TOpts | NullOrUndef;
}

export interface GetCommonServiceProviderOpts<
  TAppConfig extends AppConfigCore = AppConfigCore
> {
  browserGlobalErrorListeners?: boolean | NullOrUndef;
  zoneChangeDetection?: ServiceProviderOpts<NgZoneOptions>;
  httpClient?: boolean | NullOrUndef;
  matDialogModule?: boolean | NullOrUndef;

  appConfig?: LoadAppConfigOpts<TAppConfig> | NullOrUndef;
  appStateServiceType?: Type<any> | NullOrUndef;
  basicAppSettingsIDbAdapter?: BasicAppSettingsDbAdapter | NullOrUndef;
  asyncRequestStateManagerFactory?: boolean | NullOrUndef;
  intIdServiceFactory?: boolean | NullOrUndef;
  darkModeAppInitializer?: boolean | NullOrUndef;
}

export interface GetCommonServiceProvidersArgs<
  TAppConfig extends AppConfigCore = AppConfigCore
> {
  provide: GetCommonServiceProviderOpts<TAppConfig>;
  routes?: Route[];
  appProviders: (Provider | EnvironmentProviders | null)[];
}

export const defaultConfigNormalizeFactory = <
  TConfig extends AppConfigCore = AppConfigCore
>(
  appConfig: TConfig
) => {
  appConfig.isWebApp ??= true;
  appConfig.routeBasePath ??= '/app';
  appConfig.requiresSetup ??= false;
  return appConfig;
};

export class AppConfigProvidersFactory<
  TAppConfig extends AppConfigCore = AppConfigCore
> {
  appConfig: TAppConfig | null = null;

  getProviders(
    opts: LoadAppConfigOpts<TAppConfig>
  ): (Provider | EnvironmentProviders)[] {
    return [
      provideAppInitializer(async () => {
        let appConfig =
          opts.values ??
          (await loadAppConfig<TAppConfig>(inject(HttpClient), opts));

        if (opts.configNormalizeFactory) {
          appConfig = opts.configNormalizeFactory(appConfig);
        }

        if (opts.applyConfigDefaults ?? true) {
          appConfig = defaultConfigNormalizeFactory(appConfig);
        }

        this.appConfig = appConfig;
      }),
      {
        provide: injectionTokens.appConfig.token,
        useFactory: () => this.appConfig,
      },
    ];
  }
}

export const getDarkModeAppInitializer = () =>
  provideAppInitializer(() => {
    const darkModeService = inject(DarkModeService);
    darkModeService.init();
  });

export const getServiceProviders = <
  TAppConfig extends AppConfigCore = AppConfigCore
>(
  args: GetCommonServiceProvidersArgs<TAppConfig>
) => {
  const opts = args.provide;

  const providersArr: (Provider | EnvironmentProviders | null)[] = [
    opts.browserGlobalErrorListeners ?? true
      ? provideBrowserGlobalErrorListeners()
      : null,

    opts.zoneChangeDetection?.provide
      ? provideZoneChangeDetection(opts.zoneChangeDetection.opts ?? {})
      : null,

    opts.httpClient ?? true ? provideHttpClient() : null,

    opts.matDialogModule ?? true ? importProvidersFrom(MatDialogModule) : null,

    ...(opts.appConfig?.provide ?? true
      ? new AppConfigProvidersFactory<TAppConfig>().getProviders(
          opts.appConfig ?? {
            values: {} as TAppConfig,
            isProd: true,
          }
        )
      : []),

    opts.appStateServiceType
      ? { provide: AppStateServiceBase, useClass: opts.appStateServiceType }
      : null,

    opts.basicAppSettingsIDbAdapter
      ? {
          provide: injectionTokens.basicAppSettingsDbAdapter.token,
          useValue: opts.basicAppSettingsIDbAdapter,
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
