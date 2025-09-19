import { environment } from '../../environments/environment';
import { AppConfig } from './app-config';
import { getAppConfigProvider } from '../../trmrk-angular/services/common/app-config-provider';

export const appConfigProvider = getAppConfigProvider<AppConfig>({
  isProd: environment.production,
  configMergeFactory: (baseConfig, envConfig) => {
    baseConfig.driveStorageOptions.push(...(envConfig.driveStorageOptions ?? []));
    return baseConfig;
  },
});
