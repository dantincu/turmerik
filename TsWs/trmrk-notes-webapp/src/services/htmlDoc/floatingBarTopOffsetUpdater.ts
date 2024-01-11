export interface FloatingBarTopOffset {
  showHeader: boolean | null;
  headerIsHidden: boolean;
  appBarHeight: number | null;
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

export const updateFloatingBarTopOffset = <Element extends HTMLElement>(
  offset: FloatingBarTopOffset,
  appBarEl: Element | null,
  appMainEl: Element | null
) => {
  if (typeof offset.showHeader === "boolean") {
    offset.lastHeaderTopOffset = 0;

    if (offset.showHeader === true) {
      if (appBarEl) {
        offset.appBarHeight ??= appBarEl.clientHeight;
        appBarEl.style.top = "0px";

        offset.headerIsHidden = false;
        offset.showHeader = null;

        if (appMainEl) {
          appMainEl.style.top =
            offset.lastHeaderTopOffset + offset.appBarHeight + "px";
        } else {
        }
      }
    } else if (offset.showHeader === false) {
      if (appMainEl) {
        offset.appBarHeight ??= appBarEl?.clientHeight ?? 0;
        appMainEl.style.top = "0px";

        offset.headerIsHidden = true;
        offset.showHeader = null;
      }
    }
  } else {
    if (appBarEl && appMainEl) {
      offset.appBarHeight ??= appBarEl.clientHeight;

      if (offset.headerIsHidden) {
        appMainEl.style.top = "0px";
      } else {
        const bodyScrollTop = appMainEl.scrollTop;
        const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;

        const headerTopOffset = Math.max(
          offset.lastHeaderTopOffset - bodyScrollTopDiff,
          -1 * offset.appBarHeight
        );

        offset.lastBodyScrollTop = bodyScrollTop;
        offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);

        appBarEl.style.top = offset.lastHeaderTopOffset + "px";
        appMainEl.style.top =
          offset.lastHeaderTopOffset + offset.appBarHeight + "px";
      }
    }
  }
};
