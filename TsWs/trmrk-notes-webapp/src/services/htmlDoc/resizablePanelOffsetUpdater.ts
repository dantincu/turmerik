export const RESIZABLE_BORDER_SIZE = 4;

export const updateResizablePanelOffset = <Element extends HTMLElement>(
  leftPanelEl: Element | null,
  rightPanelEl: Element | null,
  dx: number,
  minWidth: number | null
) => {
  minWidth ??= RESIZABLE_BORDER_SIZE;

  if (leftPanelEl) {
    // Snippen taken from first answer from
    // https://stackoverflow.com/questions/26233180/resize-a-div-on-border-drag-and-drop-without-adding-extra-markup
    let leftWidth = parseInt(getComputedStyle(leftPanelEl, "").width) + dx;

    leftWidth = Math.max(leftWidth, minWidth);
    leftPanelEl.style.width = leftWidth + "px";
  }

  if (rightPanelEl) {
    let leftOffset = parseInt(getComputedStyle(rightPanelEl, "").left) + dx;

    leftOffset = Math.max(leftOffset, minWidth);
    rightPanelEl.style.left = leftOffset + "px";
  }
};
