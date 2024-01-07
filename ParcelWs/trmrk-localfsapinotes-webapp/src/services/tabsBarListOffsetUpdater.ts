export interface TabsListOffset {
  tabsBarWidth: number;
  tabsListWidth: number;
  tabHeadWidth: number;
  tabsListLeftSpacerWidth: number;
  tabsListRightSpacerWidth: number;
  leftOffset: number;
  tabsCount: number;
  currentTabIdx: number;
}

export interface TabsListKeyElements<Element extends HTMLDivElement> {
  tabsBarRefEl: Element | null | undefined;
  tabsListRefEl: Element | null | undefined;
  tabsListLeftSpacerRefEl: Element | null | undefined;
  tabsListRightSpacerRefEl: Element | null | undefined;
}

export const assureOffsetHasWidth = <Element extends HTMLDivElement>(
  offset: TabsListOffset,
  elems: TabsListKeyElements<Element>
) => {
  if (offset.tabHeadWidth === 0) {
    offset.tabHeadWidth =
      elems.tabsListRefEl?.querySelector(".trmrk-tab-head")?.clientWidth ?? 0;
  }

  if (offset.tabsListLeftSpacerWidth === 0) {
    offset.tabsListLeftSpacerWidth =
      elems.tabsListLeftSpacerRefEl?.clientWidth ?? 0;
  }

  if (offset.tabsListRightSpacerWidth === 0) {
    offset.tabsListRightSpacerWidth =
      elems.tabsListRightSpacerRefEl?.clientWidth ?? 0;
  }
};

export const updateTabsBarListOffset = <Element extends HTMLDivElement>(
  offset: TabsListOffset,
  elems: TabsListKeyElements<Element>
) => {
  if (
    elems.tabsBarRefEl &&
    elems.tabsListRefEl &&
    offset.tabsCount > 0 &&
    offset.currentTabIdx >= 0 &&
    offset.currentTabIdx < offset.tabsCount
  ) {
    offset.tabsBarWidth = elems.tabsBarRefEl.clientWidth;
    offset.tabsListWidth = elems.tabsListRefEl.clientWidth;

    if (
      offset.currentTabIdx === 0 ||
      offset.tabsBarWidth >= offset.tabsListWidth
    ) {
      elems.tabsListRefEl.style.left = "0px";
      elems.tabsListLeftSpacerRefEl!.style.zIndex = "0";
      elems.tabsListRightSpacerRefEl!.style.zIndex = "1";
    } else {
      const elemsArr = elems.tabsListRefEl.querySelectorAll(".trmrk-tab-head");
      const currentTabEl = elemsArr[offset.currentTabIdx];

      if (currentTabEl) {
        const availableSpaceWidth =
          (offset.tabsBarWidth - offset.tabHeadWidth) / 2;

        const fullBaseOffset = (currentTabEl as any).offsetLeft;

        if (fullBaseOffset <= availableSpaceWidth) {
          elems.tabsListRefEl.style.left = "0px";
          elems.tabsListLeftSpacerRefEl!.style.zIndex = "0";
          elems.tabsListRightSpacerRefEl!.style.zIndex = "1";
        } else {
          const availableSpaceWidthRounded = Math.round(availableSpaceWidth);

          elems.tabsListRefEl.style.left =
            (availableSpaceWidthRounded - fullBaseOffset).toString() + "px";

          elems.tabsListLeftSpacerRefEl!.style.zIndex = "1";
          elems.tabsListRightSpacerRefEl!.style.zIndex = "1";
        }
      }
    }

    console.log("offset", offset);
  }
};
