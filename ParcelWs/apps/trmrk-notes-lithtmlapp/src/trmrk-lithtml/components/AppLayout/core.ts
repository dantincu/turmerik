import { css, CSSResult } from "lit";

import { MtblRefValue } from "../../../trmrk/core";

import { isMobile } from "../../../trmrk-browser/domUtils/constants";

import { ObservableValueSingletonControllerFactory } from "../../controlers/ObservableValueController";

export const homePageUrlPropFactory =
  new ObservableValueSingletonControllerFactory(null, "/");

export const showAppHeaderPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppTabsBarPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppTabsBarHistoryNavButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppFooterPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppFooterHomeButtonPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

export const showAppFooterUndoRedoButtonsPropFactory =
  new ObservableValueSingletonControllerFactory(null, true);

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
        ${isMobile
          ? css`
              top: 48px;
            `
          : css`
              top: 48px;
            `}
      }

      .trmrk-app-body.trmrk-before-footer {
        bottom: 48px;
      }
    `,
  ],
};
