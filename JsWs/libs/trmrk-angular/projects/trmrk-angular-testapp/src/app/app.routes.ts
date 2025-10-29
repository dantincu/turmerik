import { Routes } from '@angular/router';

import { components } from 'trmrk-angular';

import { TrmrkHomePage } from './components/pages/trmrk-home-page/trmrk-home-page';
import { TrmrkFormsTestPage } from './components/pages/trmrk-forms-test-page/trmrk-forms-test-page';
import { TrmrkCompaniesPanelPage } from './components/pages/trmrk-companies-panel-page/trmrk-companies-panel-page';
import { TrmrkAppTreePage } from './components/pages/trmrk-app-tree-page/trmrk-app-tree-page';
import { TrmrkButtonsPage } from './components/pages/trmrk-buttons-page/trmrk-buttons-page';
import { TrmrkFormFieldsPage } from './components/pages/trmrk-form-fields-page/trmrk-form-fields-page';
import { TrmrkHorizStripsPage } from './components/pages/trmrk-horiz-strips-page/trmrk-horiz-strips-page';
import { TrmrkUserMessages } from './components/pages/trmrk-user-messages/trmrk-user-messages';
import { TrmrkColoredText } from './components/pages/trmrk-colored-text/trmrk-colored-text';
import { TrmrkMiscPage } from './components/pages/trmrk-misc-page/trmrk-misc-page';

const baseRoutes = components.pages.baseRoutes;

export const routes: Routes = baseRoutes.getAppRoutes([
  {
    path: 'forms',
    component: TrmrkFormsTestPage,
  },
  {
    path: 'companies',
    component: TrmrkCompaniesPanelPage,
  },
  {
    path: 'app-tree',
    component: TrmrkAppTreePage,
  },
  {
    path: 'buttons',
    component: TrmrkButtonsPage,
  },
  {
    path: 'form-fields',
    component: TrmrkFormFieldsPage,
  },
  {
    path: 'horiz-strips',
    component: TrmrkHorizStripsPage,
  },
  {
    path: 'user-messages',
    component: TrmrkUserMessages,
  },
  {
    path: 'colored-text',
    component: TrmrkColoredText,
  },
  {
    path: 'misc',
    component: TrmrkMiscPage,
  },
  {
    path: '',
    component: TrmrkHomePage,
  },
]);
