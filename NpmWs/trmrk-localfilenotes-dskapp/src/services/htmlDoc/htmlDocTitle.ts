import { core as trmrk } from "trmrk";

export const updateHtmlDocTitle = (title: string) => {
  if (!trmrk.isNonEmptyStr(title, true)) {
    title = "Turmerik Local Note Files";
  }

  const htmlDocTitleEl = document.getElementsByName("title")[0];

  if (htmlDocTitleEl) {
    htmlDocTitleEl.innerText = title;
  }
};
