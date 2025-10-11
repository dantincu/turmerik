import { Injectable, Inject } from '@angular/core';

import { RefLazyValue } from '../../../../trmrk/core';
import { SharedBasicAppSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/SharedBasicAppSettings';
import { BasicAppSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';
import { AppSessionsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/AppSessions';

import { injectionTokens } from '../../dependency-injection/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbDatabasesServiceCore {
  sharedBasicAppSettings = new RefLazyValue<SharedBasicAppSettingsDbAdapter>(
    () => new SharedBasicAppSettingsDbAdapter(this.appName)
  );

  basicAppSettings = new RefLazyValue<BasicAppSettingsDbAdapter>(
    () => new BasicAppSettingsDbAdapter(this.appName)
  );

  appSessions = new RefLazyValue<AppSessionsDbAdapter>(
    () => new AppSessionsDbAdapter(this.appName)
  );

  constructor(@Inject(injectionTokens.appName.token) private appName: string) {}
}
