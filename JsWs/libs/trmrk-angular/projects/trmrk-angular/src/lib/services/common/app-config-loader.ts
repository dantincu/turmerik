import { HttpClient } from '@angular/common/http';

import { NullOrUndef } from '../../../trmrk/core';
import { splice } from '../../../trmrk/arr';
import { observableToPromise } from './rxjs/observable';
import { NgAppConfigCore } from './app-config';

export interface LoadAppConfigOpts<TConfig extends NgAppConfigCore = NgAppConfigCore> {
  provide?: boolean | NullOrUndef;
  values?: TConfig | NullOrUndef;
  appConfigUrl?: string | NullOrUndef;
  envConfigUrlFactory?: ((baseAppConfigUrl: string, envName: string) => string) | NullOrUndef;
  configMergeFactory?: ((baseConfig: TConfig, envConfig: TConfig) => TConfig) | NullOrUndef;
  configNormalizeFactory?: ((config: TConfig) => Promise<TConfig>) | NullOrUndef;
  applyConfigDefaults?: boolean | NullOrUndef;
}

export const defaultBaseAppConfigUrl = '/public/app-config.json';

export const defaultEnvConfigUrlFactory: (baseAppConfigUrl: string, envName: string) => string = (
  baseAppConfigUrl: string,
  envName
) => splice(baseAppConfigUrl.split('.'), -1, 0, envName).join('.');

export const loadAppConfig = async <TConfig extends NgAppConfigCore = NgAppConfigCore>(
  httpClient: HttpClient,
  opts: LoadAppConfigOpts<TConfig>,
  envName: string
) => {
  const appConfigUrl = opts.appConfigUrl ?? defaultBaseAppConfigUrl;

  let appConfig = (await observableToPromise(httpClient.get<TConfig>(appConfigUrl))) as TConfig;

  if (opts.configMergeFactory) {
    const envConfigUrlFactory = opts.envConfigUrlFactory ?? defaultEnvConfigUrlFactory;
    const envConfigUrl = envConfigUrlFactory(appConfigUrl, envName);
    const envConfig = await observableToPromise(httpClient.get<TConfig>(envConfigUrl));

    appConfig = opts.configMergeFactory(appConfig, envConfig);
  }

  return appConfig;
};
