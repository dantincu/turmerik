import { ObservableValueSingletonControllerFactory } from "../../controlers/ObservableValueController";

export const enableAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppTabsBarPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

export const enableAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

export const enableExplorerPanelPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);
