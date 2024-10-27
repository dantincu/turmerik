import { ObservableValueSingletonControllerFactory } from "../../trmrk-lithtml/controlers/ObservableValueController";

import {
  appHeaderCustomContentStartingColumnsCountPropFactory,
  appHeaderGoToParentButtonPropFactory,
} from "../../trmrk-lithtml/dataStore/appHeader";

import {
  showAppFooterHomeButtonPropFactory,
  showAppFooterUndoRedoButtonsPropFactory,
  showAppFooterCloseSelectionButtonPropFactory,
} from "../../trmrk-lithtml/dataStore/appFooter";

import { enableExplorerPanelPropFactory } from "../../trmrk-lithtml/dataStore/appBody";

export enum AppPage {
  Home = 0,
  Settings,
  FolderEntriesList,
}

export const appPagePropFactory =
  new ObservableValueSingletonControllerFactory<AppPage | null>(null, null);

export const updateAppPageProps = (appPage: AppPage | null) => {
  appPagePropFactory.value = appPage;

  if ((appPage ?? null) !== null) {
    const isHomeOrSettingsPage = appPage! <= AppPage.Settings;
    const isHomePage = appPage === AppPage.Home;

    appHeaderGoToParentButtonPropFactory.value = {
      isVisible: !isHomeOrSettingsPage,
      isEnabled: true,
    };

    showAppFooterHomeButtonPropFactory.value = !isHomePage;
    showAppFooterUndoRedoButtonsPropFactory.value = false;
    showAppFooterCloseSelectionButtonPropFactory.value = false;

    enableExplorerPanelPropFactory.value = !isHomeOrSettingsPage;
  }
};
