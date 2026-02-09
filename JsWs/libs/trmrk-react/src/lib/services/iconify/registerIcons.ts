import home from "@iconify-icons/mdi/home";
import close from "@iconify-icons/mdi/close";
import chevronLeft from "@iconify-icons/mdi/chevron-left";
import chevronRight from "@iconify-icons/mdi/chevron-right";
import chevronUp from "@iconify-icons/mdi/chevron-up";
import chevronDown from "@iconify-icons/mdi/chevron-down";
import chevronDoubleDown from "@iconify-icons/mdi/chevron-double-down";
import chevronDoubleUp from "@iconify-icons/mdi/chevron-double-up";
import arrowBack from "@iconify-icons/mdi/arrow-back";
import arrowUp from "@iconify-icons/mdi/arrow-up";
import dotsHorizontal from "@iconify-icons/mdi/dots-horizontal";
import dotsVertical from "@iconify-icons/mdi/dots-vertical";
import contentSave from "@iconify-icons/mdi/content-save";
import edit from "@iconify-icons/mdi/edit";
import done from "@iconify-icons/mdi/done";
import notifications from "@iconify-icons/mdi/notifications";
import bellNotification from "@iconify-icons/mdi/bell-notification";
import notificationClearAll from "@iconify-icons/mdi/notification-clear-all";
import dragVertical from "@iconify-icons/mdi/drag-vertical";
import dragVerticalVariant from "@iconify-icons/mdi/drag-vertical-variant";
import search from "@iconify-icons/mdi/search";
import filter from "@iconify-icons/mdi/filter";
import filterOutline from "@iconify-icons/mdi/filter-outline";
import sort from "@iconify-icons/mdi/sort";
import minimize from "@iconify-icons/mdi/minimize";
import windowMinimize from "@iconify-icons/mdi/window-minimize";

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
import tabGroup from "@iconify-icons/material-symbols/tab-group";
import selectWindow from "@iconify-icons/material-symbols/select-window";

import commandOutline from "@iconify-icons/solar/command-outline";
import commandBold from "@iconify-icons/solar/command-bold";

import { registerIconifyIconsCore } from "./iconsRegistration";

export const registerIconifyIcons = () => {
  registerIconifyIconsCore("mdi", {
    home,
    close,
    ["chevron-left"]: chevronLeft,
    ["chevron-right"]: chevronRight,
    ["chevron-up"]: chevronUp,
    ["chevron-down"]: chevronDown,
    ["chevron-double-down"]: chevronDoubleDown,
    ["chevron-double-up"]: chevronDoubleUp,
    ["arrow-back"]: arrowBack,
    ["arrow-up"]: arrowUp,
    ["dots-horizontal"]: dotsHorizontal,
    ["dots-vertical"]: dotsVertical,
    ["content-save"]: contentSave,
    edit,
    done,
    notifications,
    ["bell-notification"]: bellNotification,
    ["notification-clear-all"]: notificationClearAll,
    ["drag-vertical"]: dragVertical,
    ["drag-vertical-variant"]: dragVerticalVariant,
    search,
    filter,
    ["filter-outline"]: filterOutline,
    sort,
    minimize,
    ["window-minimize"]: windowMinimize,
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
    ["tab-group"]: tabGroup,
    ["select-window"]: selectWindow,
  });

  registerIconifyIconsCore("solar", {
    ["command-outline"]: commandOutline,
    ["command-bold"]: commandBold,
  });
};
