import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import { ComponentFlags } from "./core";

/* EXPLORER PANEL
 */

/** Indicates whether to ***enable the explorer panel*** */
export const enableExplorerPanelPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);
