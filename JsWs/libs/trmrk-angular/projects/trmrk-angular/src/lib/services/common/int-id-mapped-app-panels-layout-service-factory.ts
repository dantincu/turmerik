import { Injectable } from '@angular/core';

import { IntIdMappedServiceFactoryBase } from './int-id-mapped-service-factory-base';
import { AppPanelsLayoutService } from './app-panels-layout-service';
import { AppServiceBase } from './app-service-base';
import { IndexedDbDatabasesServiceCore } from './indexedDb/indexed-db-databases-service-core';

@Injectable({
  providedIn: 'root',
})
export class IntIdMappedAppPanelsLayoutServiceFactory extends IntIdMappedServiceFactoryBase<AppPanelsLayoutService> {
  constructor(
    private appService: AppServiceBase,
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore
  ) {
    super();
  }

  override create(id: number): AppPanelsLayoutService {
    const service = new AppPanelsLayoutService(this.appService, this.indexedDbDatabasesService);

    service.id = id;
    return service;
  }
}
