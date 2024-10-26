import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import { BsPopoverManager } from "../services/BsPopoverManager";

export const homePageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/");

export const settingsPageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/settings");

export const showAppOptionsPopoverPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

export const optionsPopoverManagerPropFactory =
  new ObservableValueSingletonControllerFactory<BsPopoverManager<HTMLElement> | null>(
    null,
    null
  );
