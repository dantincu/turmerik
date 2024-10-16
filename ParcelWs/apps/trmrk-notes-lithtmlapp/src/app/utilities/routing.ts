import { appPagePropFactory } from "./data";

export const catchAllNotFound = (
  catchAllPseudoParamName: string,
  levels?: number | null | undefined
) => {
  levels ??= 0;

  let path =
    levels > 0
      ? Array.from(Array(levels)).map((val, idx) => {
          const retStr = `/:${catchAllPseudoParamName + (idx + 1)}?`;
          return retStr;
        })
      : "";

  path = `${path}/:${catchAllPseudoParamName}*`;

  return {
    path,
    action: () => {
      appPagePropFactory.observable.value = null;
      const retElem = document.createElement("trmrk-not-found-page");
      retElem.setAttribute("showHomePageBtn", "");
      return retElem;
    },
  };
};
