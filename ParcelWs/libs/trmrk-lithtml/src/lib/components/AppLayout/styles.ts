import { css, CSSResult } from "lit";

import { MtblRefValue } from "../../../trmrk/core";

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
