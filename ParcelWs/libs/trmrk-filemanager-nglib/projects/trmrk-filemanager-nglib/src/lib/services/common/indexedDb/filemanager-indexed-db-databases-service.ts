import { Injectable, Inject } from '@angular/core';

import { RefLazyValue } from '../../../../trmrk/core';
import { injectionTokens } from '../../../../trmrk-angular/services/dependency-injection/injection-tokens';

import { FsApiDriveItemsDbAdapter } from './databases/FsApiDriveItems';

@Injectable({
  providedIn: 'root',
})
export class FileManagerIndexedDbDatabasesService {
  fsApiDriveItemsDbAdapter = new RefLazyValue<FsApiDriveItemsDbAdapter>(
    () => new FsApiDriveItemsDbAdapter(this.appName)
  );

  constructor(@Inject(injectionTokens.appName.token) private appName: string) {}
}
