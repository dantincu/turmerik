import { ObservableValueSingletonControllerFactory } from "../../controlers/ObservableValueController";

export const enableAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const enableAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);
