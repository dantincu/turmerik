import { ObservableValueSingletonControllerFactory } from "../controlers/ObservableValueController";

import { ComponentFlags } from "./core";

/* APP HEADER
 */

/** Indicates whether to show the ***app header*** or not */
export const showAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates the number of starting columns of the app header to leave for custom content (default 0) */
export const appHeaderCustomContentStartingColumnsCountPropFactory =
  new ObservableValueSingletonControllerFactory(null, 0);

/* ---------- => APP TABS BAR
 */

/** Indicates whether to show the ***app tabs bar*** or not */
export const showAppTabsBarPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const appHeaderGoToParentButtonPropFactory =
  new ObservableValueSingletonControllerFactory<ComponentFlags>(null, {
    isVisible: false,
    isEnabled: true,
  });

/** Indicates whether to show the ***app header history nav buttons*** or not */
export const showAppHeaderHistoryNavButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates whether to show the ***app header history nav buttons*** or not */
export const enableAppHeaderHistoryNavButtonsDefaultBehaviorPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates whether the ***app header history back button*** is enabled or not */
export const appHeaderHistoryBackButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates whether the ***app header history forward button*** is enabled or not */
export const appHeaderHistoryForwardButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ----------- => OPTIONS BUTTON
 */

/** Gets or sets the ***app header options button dom element*** */
export const appHeaderOptiosButtonDomElemPropFactory =
  new ObservableValueSingletonControllerFactory<HTMLElement | null>(null, null);

/** Indicates whether to show the ***app header options button*** or not */
export const showAppHeaderOptiosButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);
