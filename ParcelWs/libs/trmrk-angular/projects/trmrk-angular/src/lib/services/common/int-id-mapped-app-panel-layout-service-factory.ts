import { Injectable } from '@angular/core';

import { IntIdMappedServiceFactoryBase } from './int-id-mapped-service-factory-base';
import { AppPanelLayoutService } from './app-panel-layout-service';

@Injectable({
  providedIn: 'root',
})
export class IntIdMappedAppPanelLayoutServiceFactory extends IntIdMappedServiceFactoryBase<AppPanelLayoutService> {
  override create(id: number): AppPanelLayoutService {
    const service = new AppPanelLayoutService();
    service.id = id;
    return service;
  }
}
