import { Injectable, Inject } from '@angular/core';

import { RefLazyValue } from '../../../../trmrk/core';
import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';
import { TrmrkObservable } from '../../../../trmrk-angular/services/common/TrmrkObservable';
import { BasicAppSettingsDbAdapter } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { AppConfig } from '../app-config';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbDatabasesService {
  basicAppSettings = new RefLazyValue<BasicAppSettingsDbAdapter>(
    () => new BasicAppSettingsDbAdapter(this.appName)
  );

  constructor(@Inject(injectionTokens.appName.token) private appName: string) {}
}
