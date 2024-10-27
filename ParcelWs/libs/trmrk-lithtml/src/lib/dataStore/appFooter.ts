import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import { ComponentFlags } from "./core";

/* APP FOOTER
 */

/** Indicates whether to show the ***app footer*** or not */
export const showAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ---------- => HOME BUTTON
 */

/** Indicates whether to show the ***app footer home button*** or not */
export const showAppFooterHomeButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ---------- => UNDO REDO BUTTONS
 */

/** Indicates whether to show the ***app footer undo redo buttons*** or not */
export const showAppFooterUndoRedoButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates whether the ***app footer undo button*** is enabled or not */
export const appFooterUndoButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates whether the ***app footer redo button*** is enabled or not */
export const appFooterRedoButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/* ----------- => CLOSE SELECTION BUTTON
 */

/** Indicates whether to show the ***app header options button*** or not */
export const showAppFooterCloseSelectionButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);
