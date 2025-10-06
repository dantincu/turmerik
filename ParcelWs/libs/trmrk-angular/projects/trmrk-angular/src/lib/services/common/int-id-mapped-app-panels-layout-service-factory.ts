import { Injectable, Inject } from '@angular/core';

import { BasicAppSettingsDbAdapter } from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { IntIdMappedServiceFactoryBase } from './int-id-mapped-service-factory-base';
import { AppPanelsLayoutService } from './app-panels-layout-service';
import { injectionTokens } from '../dependency-injection/injection-tokens';
import { AppServiceBase } from './app-service-base';

@Injectable({
  providedIn: 'root',
})
export class IntIdMappedAppPanelsLayoutServiceFactory extends IntIdMappedServiceFactoryBase<AppPanelsLayoutService> {
  constructor(
    private appService: AppServiceBase,
    @Inject(injectionTokens.basicAppSettingsDbAdapter.token)
    private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter
  ) {
    super();
  }

  override create(id: number): AppPanelsLayoutService {
    const service = new AppPanelsLayoutService(this.appService, this.basicAppSettingsDbAdapter);

    service.id = id;
    return service;
  }
}
