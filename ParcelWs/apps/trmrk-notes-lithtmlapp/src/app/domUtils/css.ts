import * as bootstrapObj from "bootstrap";
import {
  getGlobalStylesArr,
  globalStyles as globalStylesObj,
} from "../../trmrk-lithtml/domUtils/css";

export const globalStyles = [...getGlobalStylesArr()];

export const bootstrap = bootstrapObj;

globalStylesObj.value = globalStyles;
