import {
  isIPadOrIphone as isIPadOrIphoneFunc,
  isAndroid as isAndroidFunc,
} from "./core";

export const isIPadOrIphone = isIPadOrIphoneFunc();
export const isAndroid = isAndroidFunc();
export const isMobile = isIPadOrIphone || isAndroid;
