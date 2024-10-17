import { ObservableValueSingletonControllerFactory } from "../../trmrk-lithtml/controlers/ObservableValueController";

import {
  appHeaderCustomContentStartingColumnsCountPropFactory,
  enableExplorerPanelPropFactory,
  showAppTabsBarPropFactory,
  showAppFooterPropFactory,
  showAppFooterHomeButtonPropFactory,
  showAppFooterUndoRedoButtonsPropFactory,
  showAppFooterCloseSelectionButtonPropFactory,
} from "../../trmrk-lithtml/components/AppLayout/core";

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
    enableExplorerPanelPropFactory.value = false;
    if (appPage! <= AppPage.Settings) {
      if (appPage == AppPage.Home) {
        appHeaderCustomContentStartingColumnsCountPropFactory.value = 1;
        showAppTabsBarPropFactory.value = false;
        showAppFooterPropFactory.value = true;
        showAppFooterHomeButtonPropFactory.value = false;
        showAppFooterUndoRedoButtonsPropFactory.value = false;
        showAppFooterCloseSelectionButtonPropFactory.value = false;
      } else if (appPage == AppPage.Settings) {
        appHeaderCustomContentStartingColumnsCountPropFactory.value = 0;
        showAppTabsBarPropFactory.value = true;
        showAppFooterPropFactory.value = false;
        showAppFooterHomeButtonPropFactory.value = true;
        showAppFooterUndoRedoButtonsPropFactory.value = false;
        showAppFooterCloseSelectionButtonPropFactory.value = false;
      }
    } else {
      enableExplorerPanelPropFactory.value = true;
      appHeaderCustomContentStartingColumnsCountPropFactory.value = 0;
      showAppTabsBarPropFactory.value = true;
      showAppFooterPropFactory.value = false;
      showAppFooterHomeButtonPropFactory.value = true;
      showAppFooterUndoRedoButtonsPropFactory.value = false;
      showAppFooterCloseSelectionButtonPropFactory.value = false;
    }
  }
};
