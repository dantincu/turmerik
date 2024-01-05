import React from "react";

export interface FloatingBarTopOffset {
  showHeader: boolean | null;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

export const updateFloatingBarTopOffset = <Element extends HTMLElement>(
  offset: FloatingBarTopOffset,
  appBarEl: Element | null,
  appMainEl: Element | null,
  appBarHeight: number | null = null
) => {
  if (typeof offset.showHeader === "boolean") {
    offset.lastHeaderTopOffset = 0;
    offset.lastBodyScrollTop = 0;

    if (offset.showHeader === true) {
      if (appBarEl) {
        appBarEl.style.top = "0px";
        offset.showHeader = null;

        if (appMainEl) {
          appMainEl.style.top = appBarEl.clientHeight + "px";
        }
      }
    } else if (offset.showHeader === false) {
      if (appMainEl) {
        appMainEl.style.top = (appBarHeight ?? 0) + "px";
        offset.showHeader = null;
      }
    }
  } else {
    if (appBarEl && appMainEl) {
      const bodyScrollTop = appMainEl.scrollTop;
      appBarHeight ??= appBarEl.clientHeight;

      const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
      offset.lastBodyScrollTop = bodyScrollTop;

      const headerTopOffset = Math.max(
        offset.lastHeaderTopOffset - bodyScrollTopDiff,
        -1 * appBarHeight
      );

      offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);

      appBarEl.style.top = offset.lastHeaderTopOffset + "px";
      appMainEl.style.top = offset.lastHeaderTopOffset + appBarHeight + "px";
    }
  }
};
