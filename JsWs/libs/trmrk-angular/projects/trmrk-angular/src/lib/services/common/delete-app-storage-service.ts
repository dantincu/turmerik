import { Injectable } from '@angular/core';

import { AppStateServiceBase } from './app-state-service-base';

@Injectable({
  providedIn: 'root',
})
export class DeleteAppStorageService {
  constructor(public appStateService: AppStateServiceBase) {}

  async deleteStorage(dbObjNamePrefix: string) {
    for (let storage of [localStorage, sessionStorage]) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);

        if (key?.startsWith(dbObjNamePrefix)) {
          storage.removeItem(key!);
        }
      }
    }

    let databases = await indexedDB.databases();
    databases = databases.filter((db) => db.name?.startsWith(dbObjNamePrefix));
    const promises = databases.map((db) => indexedDB.deleteDatabase(db.name!));
    await Promise.all(promises);
  }
}
