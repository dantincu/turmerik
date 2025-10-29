import { Injectable, Inject } from '@angular/core';

import { RefLazyValue } from '../../../../trmrk/core';
import { BasicAppSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';
import { BasicAppSessionSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSession';
import { AppSessionsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/AppSessions';

import { injectionTokens } from '../../dependency-injection/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbDatabasesServiceCore {
  sharedBasicAppSettings = new RefLazyValue<BasicAppSettingsDbAdapter>(
    () => new BasicAppSettingsDbAdapter(this.appName)
  );

  basicAppSettings = new RefLazyValue<BasicAppSessionSettingsDbAdapter>(
    () => new BasicAppSessionSettingsDbAdapter(this.appName)
  );

  appSessions = new RefLazyValue<AppSessionsDbAdapter>(
    () => new AppSessionsDbAdapter(this.appName)
  );

  constructor(@Inject(injectionTokens.appName.token) private appName: string) {}
}
