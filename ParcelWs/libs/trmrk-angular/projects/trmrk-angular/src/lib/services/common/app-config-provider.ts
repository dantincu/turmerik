import { provideAppInitializer, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { loadAppConfig, LoadAppConfigOpts } from './app-config-loader';

export const getAppConfigProvider = <TAppConfig>(opts: LoadAppConfigOpts<TAppConfig>) =>
  provideAppInitializer(async () => {
    const httpClient = inject(HttpClient);
    const appConfig = await loadAppConfig<TAppConfig>(httpClient, opts);
    return appConfig;
  });
