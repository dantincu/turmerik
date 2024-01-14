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
  let bodyScrollTop: number | null = null;
  let bodyScrollTopDiff: number | null = null;

  if (appMainEl) {
    offset.appBarHeight ??= appBarEl?.clientHeight ?? null;

    bodyScrollTop = appMainEl.scrollTop;
    bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
    offset.lastBodyScrollTop = bodyScrollTop;

    let headerTopOffset = Math.max(
      offset.lastHeaderTopOffset - bodyScrollTopDiff,
      -1 * (offset.appBarHeight ?? 0)
    );

    offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);
  }

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
    if (appMainEl) {
      if (offset.headerIsHidden) {
        appMainEl.style.top = "0px";
      } else {
        if ((bodyScrollTop ?? 0) > 0) {
          // on iOs this property can be negative when dragging by the top of the page
          if (appBarEl) {
            appBarEl.style.top = offset.lastHeaderTopOffset + "px";

            appMainEl.style.top =
              offset.lastHeaderTopOffset + (offset.appBarHeight ?? 0) + "px";
          }
        }
      }
    }
  }
};
