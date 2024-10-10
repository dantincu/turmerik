import * as bootstrapObj from "bootstrap";
import { getGlobalStylesArr } from "../../trmrk-lithtml/domUtils/css";

export const globalStyles = [...getGlobalStylesArr()];

export const bootstrap = bootstrapObj;
