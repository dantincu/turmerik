import { Routes } from '@angular/router';
import { TrmrkDevPage } from './trmrk-dev-page';
import { IndexedDbBrowser } from './indexed-db-browser/indexed-db-browser';

export const createDevPageRoutes = (basePath: string = 'dev'): Routes => [
  {
    path: [basePath, 'browse-indexeddb'].join('/'),
    component: IndexedDbBrowser,
  },
  {
    path: basePath,
    component: TrmrkDevPage,
  },
];
