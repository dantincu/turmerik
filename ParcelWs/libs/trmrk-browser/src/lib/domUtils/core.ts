import trmrk from "../../trmrk";
import { MtblRefValue, jsonBool } from "../../trmrk/core";

export const supportedFeatures = {
  fileSystemApi: !!(window as any).showDirectoryPicker,
};

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
  appIsCompactMode: "appIsCompactMode",
  textCaretPositionerOpts: "textCaretPositionerOpts",
});

export const appModeCssClasses = {
  compactMode: "trmrk-mode-compact",
  fullMode: "trmrk-mode-full",
};

export const getAppModeCssClassName = (isCompactMode: boolean) => {
  const appModeClassName = isCompactMode
    ? appModeCssClasses.compactMode
    : appModeCssClasses.fullMode;

  return appModeClassName;
};

export const getRoute = (
  routeBase: string,
  path: string | null | undefined = null,
  relPath: string | null | undefined = null
) => {
  const partsArr = [path, relPath]
    .filter((value) => value)
    .map((value) => encodeURIComponent(value!));

  partsArr.splice(0, 0, routeBase);
  const route = partsArr.join("/");

  return route;
};

export const appModeCssClass = {
  value: "",
} as MtblRefValue<string>;

export const prefersDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const isDarkMode = (
  localStorageIsDarkModeKey: string | null | undefined = null
) => {
  const localStorageIsDarkMode = localStorage.getItem(
    localStorageIsDarkModeKey ?? localStorageKeys.appThemeIsDarkMode
  );

  let isDarkMode: boolean;

  if (localStorageIsDarkMode) {
    if (trmrk.jsonBool.true === localStorageIsDarkMode) {
      isDarkMode = true;
    } else if (trmrk.jsonBool.false === localStorageIsDarkMode) {
      isDarkMode = false;
    } else {
      isDarkMode = prefersDarkMode();
    }
  } else {
    isDarkMode = prefersDarkMode();
  }

  return isDarkMode;
};

export const isCompactMode = (
  localStorageIsCompactModeKey: string | null | undefined = null
) => {
  const localStorageIsCompactMode = localStorage.getItem(
    localStorageIsCompactModeKey ?? localStorageKeys.appIsCompactMode
  );

  let isCompactMode = trmrk.jsonBool.false !== localStorageIsCompactMode;
  return isCompactMode;
};

export const setIsDarkModeToLocalStorage = (
  isDarkMode: boolean,
  localStorageIsDarkModeKey: string | null | undefined = null
) =>
  localStorage.setItem(
    localStorageIsDarkModeKey ?? localStorageKeys.appThemeIsDarkMode,
    isDarkMode ? jsonBool.true : jsonBool.false
  );

export const setIsCompactModeToLocalStorage = (
  isCompactMode: boolean,
  localStorageIsCompactModeKey: string | null | undefined = null
) =>
  localStorage.setItem(
    localStorageIsCompactModeKey ?? localStorageKeys.appIsCompactMode,
    isCompactMode ? jsonBool.true : jsonBool.false
  );

/// According to https://stackoverflow.com/questions/7944460/detect-safari-browser
/// the following is the best alternative
export const isSafariFunc = () =>
  !!/^((?!chrome|android|windows).)*safari/i.test(navigator.userAgent) &&
  navigator.userAgent.indexOf("CriOS") == -1 &&
  navigator.userAgent.indexOf("FxiOS") == -1;
/// also tried the one bellow but did not work (returned false on iphone safari)
// export const isSafari = !!(window as any).safari;

export const isIPadFunc = () => /iPad/.test(navigator.userAgent);
export const isIPhoneFunc = () => /iPhone/.test(navigator.userAgent);
export const isIPadOrIphoneFunc = () => /iPad|iPhone/.test(navigator.userAgent);
export const isAndroidFunc = () => /Android/.test(navigator.userAgent);

export const extractDigits = (str: string) =>
  trmrk.transformStr(str, (chr) => (/\d/g.test(chr) ? chr : null));

export const extractDigitsAndDot = (str: string) =>
  trmrk.transformStr(str, (chr) => (/[\d\.]/g.test(chr) ? chr : null));

export const extractIntNumber = (str: string) => parseInt(extractDigits(str));

export const extractFloatNumber = (str: string) =>
  parseInt(extractDigitsAndDot(str));

export interface OverflowType {
  visible?: boolean | null | undefined;
  hidden?: boolean | null | undefined;
  clip?: boolean | null | undefined;
  scroll?: boolean | null | undefined;
  auto?: boolean | null | undefined;
  isHidden: boolean;
}

export const getOverflowType = (overflowCssPropVal: string) => {
  const retObj = {} as OverflowType;

  switch (overflowCssPropVal) {
    case "visible":
      retObj.visible = true;
      break;
    case "hidden":
      retObj.hidden = true;
      break;
    case "clip":
      retObj.clip = true;
      break;
    case "scroll":
      retObj.scroll = true;
      break;
    case "auto":
      retObj.auto = true;
      break;
    default:
      break;
  }

  retObj.isHidden = !!retObj.hidden || !!retObj.clip;
  return retObj;
};

export const getWebStorageKeys = (webStorage: Storage) => {
  const keysArr: string[] = [];

  for (let i = 0; i < webStorage.length; i++) {
    keysArr.push(webStorage.key(i)!);
  }

  return keysArr;
};

export const forEachChildNode = (
  prElem: HTMLElement | NodeListOf<ChildNode>,
  callback: (
    elem: ChildNode,
    idx: number,
    prElemChildNodesCollctn: NodeListOf<ChildNode>
  ) => boolean | any | unknown | void,
  reverseOrder: boolean = false
) => {
  callback ??= () => true;

  const prElemChildNodesCollctn =
    (prElem as HTMLElement).childNodes ?? (prElem as NodeListOf<ChildNode>);

  if (reverseOrder) {
    for (let idx = prElemChildNodesCollctn.length; idx >= 0; idx--) {
      const prElemChildNode = prElemChildNodesCollctn[idx];
      if (callback(prElemChildNode, idx, prElemChildNodesCollctn) === false) {
        break;
      }
    }
  } else {
    for (let idx = 0; idx < prElemChildNodesCollctn.length; idx++) {
      const prElemChildNode = prElemChildNodesCollctn[idx];
      if (callback(prElemChildNode, idx, prElemChildNodesCollctn) === false) {
        break;
      }
    }
  }
};

export const filterChildNodes = <TChildNode extends ChildNode = ChildNode>(
  prElem: HTMLElement | NodeListOf<ChildNode>,
  callback:
    | ((
        elem: ChildNode,
        idx: number,
        prElemChildNodesCollctn: NodeListOf<ChildNode>
      ) => boolean | any | unknown | void)
    | null
    | undefined = null,
  reverseOrder: boolean = false
) => {
  const retArr: TChildNode[] = [];
  callback ??= () => true;

  forEachChildNode(
    prElem,
    (elem, idx, prElemChildNodesCollctn) => {
      const retVal = callback(elem, idx, prElemChildNodesCollctn);

      if (retVal) {
        retArr.push(elem as TChildNode);
      }
    },
    reverseOrder
  );

  return retArr;
};

export const filterChildElements = <
  TChildNode extends HTMLElement = HTMLElement
>(
  prElem: HTMLElement | NodeListOf<ChildNode>,
  callback:
    | ((
        elem: HTMLElement,
        idx: number,
        prElemChildNodesCollctn: NodeListOf<ChildNode>
      ) => boolean | any | unknown | void)
    | null
    | undefined = null,
  reverseOrder: boolean = false
) => {
  callback ??= () => true;

  const retArr = filterChildNodes<TChildNode>(
    prElem,
    (elem, idx, prElemChildNodesCollctn) => {
      if (elem instanceof HTMLElement) {
        const retVal = callback(elem, idx, prElemChildNodesCollctn);

        if (retVal) {
          retArr.push(elem as TChildNode);
        }
      }
    },
    reverseOrder
  );

  return retArr;
};

export const withEachNode = (
  nodesMx: (ChildNode[] | NodeListOf<ChildNode>)[],
  callback: (node: ChildNode, idx: number, arr: ChildNode[]) => void
) => {
  const nodesMxNorm = nodesMx.map((arr) =>
    arr instanceof NodeList ? filterChildNodes(arr) : (arr as ChildNode[])
  );

  const nodesArr = trmrk.flatten(nodesMxNorm);
  nodesArr.forEach(callback);
};

export const filterChildNodesArr = <TChildNode extends ChildNode>(
  nodesMx: (ChildNode[] | NodeListOf<ChildNode>)[],
  callback:
    | ((
        node: ChildNode,
        idx: number,
        arr: ChildNode[]
      ) => boolean | any | unknown | void)
    | null
    | undefined = null
) => {
  const retArr: TChildNode[] = [];
  callback ??= () => true;

  withEachNode(nodesMx, (elem, idx, nodesArr) => {
    const retVal = callback(elem, idx, nodesArr);

    if (retVal) {
      retArr.push(elem as TChildNode);
    }
  });

  return retArr;
};

export const filterChildElementsArr = <
  TChildNode extends HTMLElement = HTMLElement
>(
  nodesMx: (ChildNode[] | NodeListOf<ChildNode>)[],
  callback:
    | ((
        node: TChildNode,
        idx: number,
        arr: ChildNode[]
      ) => boolean | any | unknown | void)
    | null
    | undefined = null,
  elemTagName: string | null | undefined = null
) => {
  callback ??= () => true;

  const retArr = filterChildNodesArr<TChildNode>(
    nodesMx,
    (elem, idx, prElemChildNodesCollctn) => {
      if (
        elem instanceof HTMLElement &&
        (!elemTagName || elem.tagName === elemTagName)
      ) {
        const retVal = callback(
          elem as TChildNode,
          idx,
          prElemChildNodesCollctn
        );

        if (retVal) {
          retArr.push(elem as TChildNode);
        }
      }
    }
  );

  return retArr;
};

export const extractNestedElement = <TElement = HTMLElement>(
  prElem: HTMLElement | NodeListOf<ChildNode>,
  predicate: (
    elem: HTMLElement,
    idx: number,
    prElemChildNodesCollctn: NodeListOf<ChildNode>
  ) => boolean | any | unknown | void,
  reverseOrder: boolean = false
) => {
  let retElem: TElement | null = null;

  forEachChildNode(
    prElem,
    (elem, idx, collctn) => {
      if (elem instanceof HTMLElement) {
        if (predicate(elem, idx, collctn)) {
          retElem = elem as TElement;
        } else {
          retElem = extractNestedElement(elem, predicate);
        }

        return !retElem;
      }
    },
    reverseOrder
  );

  return retElem;
};

export const clearTimeouIfReqCore = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | null | undefined,
  clearFunc: (timeoutId: NodeJS.Timeout) => void
) => {
  const timeoutId = timeoutIdRef?.value;

  if (timeoutId) {
    clearFunc(timeoutId);
    timeoutIdRef.value = null;
  }
};

export const clearTimeoutIfReq = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | null | undefined
) => clearTimeouIfReqCore(timeoutIdRef, clearTimeout);

export const clearIntervalIfReq = (
  timeoutIdRef: MtblRefValue<NodeJS.Timeout | null> | null | undefined
) => clearTimeouIfReqCore(timeoutIdRef, clearInterval);

export const updateDisableAttr = (
  elem: HTMLElement,
  disabledValue: boolean | null | undefined
) => {
  if (disabledValue) {
    elem.setAttribute("disabled", "");
  } else {
    elem.removeAttribute("disabled");
  }
};
