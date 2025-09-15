import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResetAppService {
  async resetApp(dbObjNamePrefix: string) {
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
