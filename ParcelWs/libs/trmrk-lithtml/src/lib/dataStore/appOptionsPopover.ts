import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import { ComponentFlags } from "./core";

export const appLayoutOptionsPopoverDomElemTagNamePropFactory =
  new ObservableValueSingletonControllerFactory<string>(
    null,
    "trmrk-app-options-popover-content"
  );

export const refreshAppPageButtonPropFactory =
  new ObservableValueSingletonControllerFactory<ComponentFlags>(null, {
    isVisible: true,
    isEnabled: true,
  });

export const viewOpenTabsButtonPropFactory =
  new ObservableValueSingletonControllerFactory<ComponentFlags>(null, {
    isVisible: true,
    isEnabled: true,
  });

export const goToSettingsPageButtonPropFactory =
  new ObservableValueSingletonControllerFactory<ComponentFlags>(null, {
    isVisible: true,
    isEnabled: true,
  });
