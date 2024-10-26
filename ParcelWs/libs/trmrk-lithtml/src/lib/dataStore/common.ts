import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

/** Gets or sets the ***home page url*** */
export const homePageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/");
