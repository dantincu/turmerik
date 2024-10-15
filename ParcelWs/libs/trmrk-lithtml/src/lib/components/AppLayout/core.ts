import { css, CSSResult } from "lit";

import { MtblRefValue } from "../../../trmrk/core";

import { ObservableValueSingletonControllerFactory } from "../../controlers/ObservableValueController";

/* APP LAYOUT CSS CLASS
 */

/** Gets or sets the ***app layout css class*** */
export const appLayoutCssClassPropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DOC TITLE
 */

/** Gets or sets the ***html doc title*** */
export const docTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DEFAULT DOC TITLE
 */

/** Gets or sets the ***html doc title*** */
export const defaultDocTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* APP TITLE
 */

/** Gets or sets the ***app title*** */
export const appTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* DEFAULT APP TITLE
 */

/** Gets or sets the ***app title*** */
export const defaultAppTitlePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(null, null);

/* APP HEADER
 */

/** Indicates whether to show the ***app header*** or not */
export const showAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ---------- => APP TABS BAR
 */

/** Indicates whether to show the ***app tabs bar*** or not */
export const showAppTabsBarPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ----------- = ------------ -> HISTORY NAV BUTTONS
 */

/** Indicates whether to show the ***app tabs bar history nav buttons*** or not */
export const showAppTabsBarHistoryNavButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates whether the ***app tabs bar history back button*** is enabled or not */
export const appTabsBarHistoryBackButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates whether the ***app tabs bar history forward button*** is enabled or not */
export const appTabsBarHistoryForwardButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

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

/** Gets or sets the ***home page url*** */
export const homePageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/");

/* ---------- => UNDO REDO BUTTONS
 */

/** Indicates whether to show the ***app footer undo redo buttons*** or not */
export const showAppFooterUndoRedoButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/** Indicates whether the ***app footer undo button*** is enabled or not */
export const appFooterUndoButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates whether the ***app footer redo button*** is enabled or not */
export const appFooterRedoButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/* EXPLORER PANEL
 */

/** Indicates whether to ***enable the explorer panel*** */
export const enableExplorerPanelPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const AppLayoutStyles: MtblRefValue<CSSResult[]> = {
  value: [
    css`
      .trmrk-app-layout {
        display: block;
        position: relative;
        z-index: 0;
        height: 100%;
        width: 100vw;
        box-sizing: border-box;
      }

      .trmrk-app-header,
      .trmrk-app-footer {
        display: flex;
        position: absolute;
        width: 100%;
        height: 48px;
        padding: 1px;
        cursor: pointer;
        z-index: 500;
        overflow: hidden;
      }

      .trmrk-app-header {
        border-bottom: 1px solid #888;
        padding-top: 2px;
      }

      .trmrk-app-header h1 {
        text-align: center;
        width: 100%;
      }

      .trmrk-app-footer {
        bottom: 0px;
        border-top: 1px solid #888;
      }

      .trmrk-app-body {
        display: flex;
        position: absolute;
        inset: 0;
        margin: 0px;
        padding: 0px;
      }

      .trmrk-app-body.trmrk-after-header {
        top: 48px;
      }

      .trmrk-app-body.trmrk-before-footer {
        bottom: 48px;
      }
    `,
  ],
};
