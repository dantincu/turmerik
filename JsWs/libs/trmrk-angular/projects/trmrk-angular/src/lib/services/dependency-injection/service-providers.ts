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

import { NullOrUndef, withVal, RefLazyValue } from '../../../trmrk/core';
import { normalizeAppConfigCore } from '../../../trmrk/app-config';
import { AsyncRequestStateManagerFactory } from '../../../trmrk/AsyncRequestStateManager';

import { AppServiceBase } from '../common/app-service-base';
import { AppStateServiceBase } from '../common/app-state-service-base';
import { IntIdServiceFactory } from '../common/int-id-service-factory';
import { loadAppConfig, LoadAppConfigOpts } from '../common/app-config-loader';
import { TimeStampGeneratorBase } from '../common/timestamp-generator-base';
import { DefaultTimeStampGenerator } from '../common/default-timestamp-generator';
import { TrmrkStrIdGeneratorBase } from '../common/trmrk-str-id-generator-base';
import { TrmrkDefaultStrIdGenerator } from '../common/trmrk-default-str-id-generator';
import { NgAppConfigCore } from '../common/app-config';
import { DarkModeService } from '../common/dark-mode-service';
import { TrmrkObservable } from '../common/TrmrkObservable';
import { TrmrkSessionService } from '../common/trmrk-session-service';
import { TrmrkBrowserTabIdServiceBase } from '../common/trmrk-browser-tab-id-service-base';
import { TrmrkDefaultBrowserTabIdService } from '../common/trmrk-default-browser-tab-id-service';

import { injectionTokens } from './injection-tokens';
import { DefaultClientFetchTmStmpMillisService } from '../common/default-client-fetch-tm-stmp-millis-service';
import { ClientFetchTmStmpMillisServiceBase } from '../common/client-fetch-tm-stmp-millis-service-base';

export interface ServiceProviderOpts<TOpts> {
  provide?: boolean | NullOrUndef;
  opts?: TOpts | NullOrUndef;
}

export interface GetCommonServiceProviderOpts<
  TAppConfig extends NgAppConfigCore = NgAppConfigCore
> {
  includeAllByDefault?: boolean | NullOrUndef;
  browserGlobalErrorListeners?: boolean | NullOrUndef;
  zoneChangeDetection?: ServiceProviderOpts<NgZoneOptions>;
  httpClient?: boolean | NullOrUndef;
  matDialogModule?: boolean | NullOrUndef;

  appConfig?: LoadAppConfigOpts<TAppConfig> | NullOrUndef;
  appServiceType?: Type<any> | NullOrUndef;
  appStateServiceType?: Type<any> | NullOrUndef;
  defaultTimeStampGenerator?: boolean | NullOrUndef;
  defaultStrIdGenerator?: boolean | NullOrUndef;
  defaultBrowserTabIdService?: boolean | NullOrUndef;
  asyncRequestStateManagerFactory?: boolean | NullOrUndef;
  intIdServiceFactory?: boolean | NullOrUndef;
  darkModeAppInitializer?: boolean | NullOrUndef;
  sessionServiceAppInitializer?: boolean | NullOrUndef;
  clientFetchTmStmpServiceAppInitializer?: boolean | NullOrUndef;
}

export interface GetCommonServiceProvidersArgs<
  TAppConfig extends NgAppConfigCore = NgAppConfigCore
> {
  envName?: string | NullOrUndef;
  isProdEnv: boolean;
  appName: string;
  provide: GetCommonServiceProviderOpts<TAppConfig>;
  routes?: Route[];
  appProviders: (Provider | EnvironmentProviders | null)[];
}

export const defaultConfigNormalizeFactory = async <
  TConfig extends NgAppConfigCore = NgAppConfigCore
>(
  appConfig: TConfig
) => {
  appConfig = normalizeAppConfigCore(appConfig);
  return appConfig;
};

export class AppConfigProvidersFactory<TAppConfig extends NgAppConfigCore = NgAppConfigCore> {
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

export const getSessionServiceAppInitializer = () =>
  provideAppInitializer(async () => {
    const service = inject(TrmrkSessionService);
    await service.assureSessionIsSet();
    await service.assureSessionTabIsSet();
  });

export const getBrowserTabIdAppInitializer = () =>
  provideAppInitializer(() => {
    const browserTabIdService = inject(TrmrkBrowserTabIdServiceBase);
    browserTabIdService.init();
  });

export const getClientFetchTmStmpMillisServiceAppInitializer = () =>
  provideAppInitializer(() => {
    const clientFetchTmStmpMillisService = inject(ClientFetchTmStmpMillisServiceBase);
    clientFetchTmStmpMillisService.init();
  });

export const getServiceProviders = <TAppConfig extends NgAppConfigCore = NgAppConfigCore>(
  args: GetCommonServiceProvidersArgs<TAppConfig>
) => {
  const opts = args.provide;
  const includeAllByDefault = opts.includeAllByDefault ?? true;

  const providersArr: (Provider | EnvironmentProviders | null)[] = [
    opts.browserGlobalErrorListeners ?? includeAllByDefault
      ? provideBrowserGlobalErrorListeners()
      : null,

    opts.zoneChangeDetection?.provide
      ? provideZoneChangeDetection(opts.zoneChangeDetection.opts ?? {})
      : null,

    opts.httpClient ?? includeAllByDefault ? provideHttpClient() : null,

    opts.matDialogModule ?? includeAllByDefault ? importProvidersFrom(MatDialogModule) : null,

    ...(opts.appConfig?.provide ?? includeAllByDefault
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

    opts.asyncRequestStateManagerFactory ?? includeAllByDefault
      ? { provide: AsyncRequestStateManagerFactory }
      : null,

    opts.intIdServiceFactory ?? includeAllByDefault
      ? {
          provide: injectionTokens.intIdServiceFactory,
          useClass: IntIdServiceFactory,
        }
      : null,

    opts.darkModeAppInitializer ?? includeAllByDefault ? getDarkModeAppInitializer() : null,

    opts.defaultTimeStampGenerator ?? includeAllByDefault
      ? withVal(new DefaultTimeStampGenerator(), (defaultTimeStampGenerator) => ({
          provide: TimeStampGeneratorBase,
          useValue: defaultTimeStampGenerator,
        }))
      : null,

    opts.defaultStrIdGenerator ?? includeAllByDefault
      ? withVal(new TrmrkDefaultStrIdGenerator(), (defaultStrIdGenerator) => ({
          provide: TrmrkStrIdGeneratorBase,
          useValue: defaultStrIdGenerator,
        }))
      : null,

    ...(opts.defaultBrowserTabIdService ?? includeAllByDefault
      ? [
          withVal(
            new RefLazyValue(() => {
              const appStateService = inject(AppStateServiceBase);
              const strIdGenerator = inject(TrmrkStrIdGeneratorBase);
              const appName = args.appName;

              const defaultBrowserTabIdService = new TrmrkDefaultBrowserTabIdService(
                appStateService,
                appName,
                strIdGenerator
              );

              return defaultBrowserTabIdService;
            }),
            (lazy) => ({
              provide: TrmrkBrowserTabIdServiceBase,
              useFactory: () => lazy.value,
            })
          ),
          getBrowserTabIdAppInitializer(),
        ]
      : []),

    ...(opts.clientFetchTmStmpServiceAppInitializer ?? includeAllByDefault
      ? [
          withVal(
            new RefLazyValue<DefaultClientFetchTmStmpMillisService>(() => {
              const appStateService = inject(AppStateServiceBase);
              const timeStampGenerator = inject(TimeStampGeneratorBase);

              const defaultClientFetchTmStmpMillisService =
                new DefaultClientFetchTmStmpMillisService(appStateService, timeStampGenerator);

              return defaultClientFetchTmStmpMillisService;
            }),
            (lazy) => ({
              provide: ClientFetchTmStmpMillisServiceBase,
              useFactory: () => lazy.value,
            })
          ),
          getClientFetchTmStmpMillisServiceAppInitializer(),
        ]
      : []),

    opts.sessionServiceAppInitializer ?? includeAllByDefault
      ? getSessionServiceAppInitializer()
      : null,

    args.routes ? provideRouter(args.routes) : null,
    ...args.appProviders,
  ];

  const retArr: (Provider | EnvironmentProviders)[] = providersArr.filter(
    (provider) => provider
  ) as (Provider | EnvironmentProviders)[];

  return retArr;
};
