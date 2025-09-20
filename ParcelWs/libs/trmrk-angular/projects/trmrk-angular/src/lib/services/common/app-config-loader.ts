import { HttpClient } from '@angular/common/http';

import { NullOrUndef } from '../../../trmrk/core';
import { splice } from '../../../trmrk/arr';
import { observableToPromise } from './rxjs/observable';
import { AppConfigCore } from './app-config';

export interface LoadAppConfigOpts<
  TConfig extends AppConfigCore = AppConfigCore
> {
  provide?: boolean | NullOrUndef;
  isProd: boolean;
  values?: TConfig | NullOrUndef;
  appConfigUrl?: string | NullOrUndef;
  envConfigUrlFactory?:
    | ((baseAppConfigUrl: string, isProd: boolean) => string)
    | NullOrUndef;
  configMergeFactory?:
    | ((baseConfig: TConfig, envConfig: TConfig) => TConfig)
    | NullOrUndef;
  configNormalizeFactory?: ((config: TConfig) => TConfig) | NullOrUndef;
  applyConfigDefaults?: boolean | NullOrUndef;
}

export const defaultBaseAppConfigUrl = '/public/app-config.json';

export const defaultEnvConfigUrlFactory: (
  baseAppConfigUrl: string,
  isProd: boolean
) => string = (baseAppConfigUrl: string, isProd) =>
  splice(baseAppConfigUrl.split('.'), -1, 0, isProd ? 'prod' : 'dev').join('.');

export const loadAppConfig = async <
  TConfig extends AppConfigCore = AppConfigCore
>(
  httpClient: HttpClient,
  opts: LoadAppConfigOpts<TConfig>
) => {
  const appConfigUrl = opts.appConfigUrl ?? defaultBaseAppConfigUrl;

  let appConfig = (await observableToPromise(
    httpClient.get<TConfig>(appConfigUrl)
  )) as TConfig;

  if (opts.configMergeFactory) {
    const envConfigUrlFactory =
      opts.envConfigUrlFactory ?? defaultEnvConfigUrlFactory;
    const envConfigUrl = envConfigUrlFactory(appConfigUrl, opts.isProd);
    const envConfig = await observableToPromise(
      httpClient.get<TConfig>(envConfigUrl)
    );

    appConfig = opts.configMergeFactory(appConfig, envConfig);
  }

  return appConfig;
};
