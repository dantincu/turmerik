import { isSafariFunc, isAndroidFunc, isIPhoneFunc, isIPadFunc } from "./core";

export const isSafari = isSafariFunc();
export const isIPad = isIPadFunc();
export const isIPhone = isIPhoneFunc();
export const isIPadOrIphone = isIPad || isIPhone;
export const isAndroid = isAndroidFunc();
export const isMobile = isIPadOrIphone || isAndroid;
