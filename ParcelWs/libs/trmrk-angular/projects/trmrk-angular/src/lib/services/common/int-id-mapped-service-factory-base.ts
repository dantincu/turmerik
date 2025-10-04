import { Injectable, OnDestroy } from '@angular/core';

import { TrmrkDisaposable } from './types';

@Injectable()
export abstract class IntIdMappedServiceFactoryBase<TService extends TrmrkDisaposable>
  implements OnDestroy
{
  private _map: { [key: number]: TService } = {};

  ngOnDestroy(): void {
    this.clearAll();
  }

  protected abstract create(id: number): TService;

  getOrCreate(id: number) {
    let service: TService = this._map[id];

    if (!service) {
      service = this.create(id);
      this._map[id] = service;
    }

    return service;
  }

  clear(id: number) {
    const service = this._map[id];
    let found = !!service;

    if (found) {
      service.dispose();
    }

    delete this._map[id];
    return found;
  }

  clearAll() {
    for (let key of Object.keys(this._map)) {
      const service = this._map[parseInt(key)];

      if (service) {
        service.dispose();
      }
    }

    this._map = {};
  }
}
