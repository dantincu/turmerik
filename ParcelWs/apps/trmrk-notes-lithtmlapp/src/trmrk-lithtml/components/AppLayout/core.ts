import { css, CSSResult } from "lit";

import { MtblRefValue } from "../../../trmrk/core";

import { ObservableValueSingletonControllerFactory } from "../../controlers/ObservableValueController";

/* APP LAYOUT DOM ELEMENT
 */

/** Gets or sets the ***app layout root dom element*** */
export const appLayoutRootDomElemPropFactory =
  new ObservableValueSingletonControllerFactory<HTMLDivElement | null>(
    null,
    null
  );

/* APP LAYOUT POPOVERS CONTAINER DOM ELEMENT
 */

/** Gets or sets the ***app layout popovers container dom element*** */
export const appLayoutPopoversContainerDomElemPropFactory =
  new ObservableValueSingletonControllerFactory<HTMLDivElement | null>(
    null,
    null
  );

export interface GetOrAddAppLayoutPopoverOpts<
  THTMLElement extends HTMLElement
> {
  appLayoutPopoversContainerDomElem: HTMLDivElement;
  cssSelector?: string | null | undefined;
  selector?: (popoversContainerDomElem: HTMLDivElement) => THTMLElement;
  popoverFactory: (popoversContainerDomElem: HTMLDivElement) => THTMLElement;
  addPopoverToContainer?: boolean | null | undefined;
}

export const getOrAddAppLayoutPopover = <THTMLElement extends HTMLElement>(
  opts: GetOrAddAppLayoutPopoverOpts<THTMLElement>
) => {
  const selector =
    opts.selector ??
    ((popoversContainerDomElem) =>
      popoversContainerDomElem.querySelector(opts.cssSelector!));

  let popoverElem = selector(opts.appLayoutPopoversContainerDomElem);

  if (!popoverElem) {
    popoverElem = opts.popoverFactory(opts.appLayoutPopoversContainerDomElem);

    if ((opts.addPopoverToContainer ?? false) !== false) {
      opts.appLayoutPopoversContainerDomElem.appendChild(popoverElem);
    }
  }
};

export const removeAppLayoutPopover = <THTMLElement extends HTMLElement>(
  appLayoutPopoversContainerDomElem: HTMLDivElement,
  popoverElem: THTMLElement | string
) => {
  if (typeof popoverElem !== "object") {
    popoverElem = appLayoutPopoversContainerDomElem.querySelector(
      popoverElem
    ) as THTMLElement;
  }

  appLayoutPopoversContainerDomElem.removeChild(popoverElem);
};

/* APP LAYOUT OPTIONS POPOVER DOM ELEMENT TAG NAME
 */

/** Gets or sets the ***app layout options popover element tag name*** */
export const appLayoutOptionsPopoverDomElemTagNamePropFactory =
  new ObservableValueSingletonControllerFactory<string | null>(
    null,
    "trmrk-app-options-popover-content"
  );

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
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates the number of starting columns of the app header to leave for custom content (default 0) */
export const appHeaderCustomContentStartingColumnsCountPropFactory =
  new ObservableValueSingletonControllerFactory(null, 0);

/* ---------- => APP TABS BAR
 */

/** Indicates whether to show the ***app tabs bar*** or not */
export const showAppTabsBarPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/* ----------- => GO TO PARENT BUTTON
 */

/** Indicates whether to show the ***go to parent button*** or not */
export const showAppHeaderGoToParentButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Indicates whether to the ***go to parent button*** is enabled or not */
export const appHeaderGoToParentButtonEnabledPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

/* ----------- => HISTORY NAV BUTTONS
 */

/** Indicates whether to show the ***app header history nav buttons*** or not */
export const showAppHeaderHistoryNavButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

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

/** Indicates whether to show the ***app header options button*** or not */
export const showAppHeaderOptiosButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/* APP FOOTER
 */

/** Indicates whether to show the ***app footer*** or not */
export const showAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/* ---------- => HOME BUTTON
 */

/** Indicates whether to show the ***app footer home button*** or not */
export const showAppFooterHomeButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

/** Gets or sets the ***home page url*** */
export const homePageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/");

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

/* EXPLORER PANEL
 */

/** Indicates whether to ***enable the explorer panel*** */
export const enableExplorerPanelPropFactory =
  new ObservableValueSingletonControllerFactory(null, false);

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

      .trmrk-app-header.h-24 {
        height: 6rem;
      }

      .trmrk-app-header.h-48 {
        height: 12rem;
      }

      .trmrk-app-header.trmrk-bottom-border-none {
        border-bottom: none;
      }

      .trmrk-app-header-icon {
        width: 40px;
        height: 40px;
        margin: 2px;
      }

      .trmrk-app-header h1 {
        font-size: 2em;
        text-align: center;
        width: 100%;
        margin-top: 2px;
      }

      .trmrk-bs-icon-btn-host-xl {
        width: 80px;
        height: 80px;
      }

      .app-error-page {
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

      .trmrk-app-panel {
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

      .trmrk-app-body.top-24 {
        top: 6rem;
      }

      .trmrk-app-body.top-48 {
        top: 12rem;
      }
    `,
  ],
};
