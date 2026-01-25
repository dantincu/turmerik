import home from "@iconify-icons/mdi/home";
import close from "@iconify-icons/mdi/close";
import chevronDoubleDown from "@iconify-icons/mdi/chevron-double-down";
import chevronDoubleUp from "@iconify-icons/mdi/chevron-double-up";
import arrowBack from "@iconify-icons/mdi/arrow-back";
import arrowUp from "@iconify-icons/mdi/arrow-up";
import dotsHorizontal from "@iconify-icons/mdi/dots-horizontal";
import dotsVertical from "@iconify-icons/mdi/dots-vertical";

import undo from "@iconify-icons/material-symbols/undo";
import redo from "@iconify-icons/material-symbols/redo";
import resize from "@iconify-icons/material-symbols/resize";
import leftPanelOpen from "@iconify-icons/material-symbols/left-panel-open";
import leftPanelClose from "@iconify-icons/material-symbols/left-panel-close";
import rightPanelOpen from "@iconify-icons/material-symbols/right-panel-open";
import rightPanelClose from "@iconify-icons/material-symbols/right-panel-close";
import leftPanelOpenOutline from "@iconify-icons/material-symbols/left-panel-open-outline";
import leftPanelCloseOutline from "@iconify-icons/material-symbols/left-panel-close-outline";
import rightPanelOpenOutline from "@iconify-icons/material-symbols/right-panel-open-outline";
import rightPanelCloseOutline from "@iconify-icons/material-symbols/right-panel-close-outline";
import viewColumnSharp from "@iconify-icons/material-symbols/view-column-sharp";
import viewColumnOutlineSharp from "@iconify-icons/material-symbols/view-column-outline-sharp";
import refresh from "@iconify-icons/material-symbols/refresh";

import commandOutline from "@iconify-icons/solar/command-outline";
import commandBold from "@iconify-icons/solar/command-bold";

import { registerIconifyIconsCore } from "./iconsRegistration";

export const registerIconifyIcons = () => {
  registerIconifyIconsCore("mdi", {
    home,
    close,
    ["chevron-double-down"]: chevronDoubleDown,
    ["chevron-double-up"]: chevronDoubleUp,
    ["arrow-back"]: arrowBack,
    ["arrow-up"]: arrowUp,
    ["dots-horizontal"]: dotsHorizontal,
    ["dots-vertical"]: dotsVertical,
  });

  registerIconifyIconsCore("material-symbols", {
    undo,
    redo,
    resize,
    ["left-panel-open"]: leftPanelOpen,
    ["left-panel-close"]: leftPanelClose,
    ["right-panel-open"]: rightPanelOpen,
    ["right-panel-close"]: rightPanelClose,
    ["left-panel-open-outline"]: leftPanelOpenOutline,
    ["left-panel-close-outline"]: leftPanelCloseOutline,
    ["right-panel-open-outline"]: rightPanelOpenOutline,
    ["right-panel-close-outline"]: rightPanelCloseOutline,
    ["view-column-sharp"]: viewColumnSharp,
    ["view-column-outline-sharp"]: viewColumnOutlineSharp,
    refresh,
  });

  registerIconifyIconsCore("solar", {
    ["command-outline"]: commandOutline,
    ["command-bold"]: commandBold,
  });
};
