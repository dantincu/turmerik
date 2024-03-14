import {
  isIPadOrIphone as isIPadOrIphoneFunc,
  isAndroid as isAndroidFunc,
} from "./utils";

export const isIPadOrIphone = isIPadOrIphoneFunc();
export const isAndroid = isAndroidFunc();
export const isMobile = isIPadOrIphone || isAndroid;
