import React from "react";

export interface FloatingBarTopOffset {
  lastHeaderTopOffset: number;
  lastBodyScrollTop: number;
}

export const updateFloatingBarTopOffset = <Element extends HTMLElement>(
  offset: FloatingBarTopOffset,
  appBarEl: React.RefObject<Element>,
  appMainEl: React.RefObject<Element>
) => {
  const headerEl = appBarEl.current!;
  const bodyEl = appMainEl.current!;

  const headerHeight = headerEl.clientHeight;
  const bodyScrollTop = bodyEl.scrollTop;

  const bodyScrollTopDiff = bodyScrollTop - offset.lastBodyScrollTop;
  offset.lastBodyScrollTop = bodyScrollTop;

  const headerTopOffset = Math.max(
    offset.lastHeaderTopOffset - bodyScrollTopDiff,
    -1 * headerHeight
  );

  offset.lastHeaderTopOffset = Math.min(0, headerTopOffset);

  headerEl.style.top = offset.lastHeaderTopOffset + "px";
  bodyEl.style.top = offset.lastHeaderTopOffset + headerHeight + "px";

  return offset;
};
