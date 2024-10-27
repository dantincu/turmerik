import { css } from "lit";

import * as bootstrapObj from "bootstrap";

import {
  getGlobalStylesArr,
  globalStyles as globalStylesObj,
} from "../../trmrk-lithtml/domUtils/css";

export const appStyle = css``;

export const globalStyles = [...getGlobalStylesArr(), appStyle];

export const bootstrap = bootstrapObj;

globalStylesObj.value = globalStyles;
