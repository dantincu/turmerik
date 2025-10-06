import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { APP_NAME } from './core';

export const iDbAdapters = {
  basicAppSettings: new BasicAppSettingsDbAdapter(APP_NAME),
};
