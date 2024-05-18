import AppBarsPanel from "./barsPanel/AppBarsPanel";
import BarsPanel from "./barsPanel/BarsPanel";
import ToggleAppBarBtn from "./barsPanel/ToggleAppBarBtn";

import ErrorEl from "./error/ErrorEl";

import * as icons from "./icons";

import LoadingDotPulse from "./loading/LoadingDotPulse";

import ResizablePanel from "./resizablePanel/ResizablePanel";

import AppearenceSettingsMenu from "./settingsMenu/AppearenceSettingsMenu";
import AppearenceSettingsMenuList from "./settingsMenu/AppearenceSettingsMenuList";
import OptionsMenu from "./settingsMenu/OptionsMenu";
import OptionsMenuList from "./settingsMenu/OptionsMenuList";
import SettingsMenu from "./settingsMenu/SettingsMenu";
import SettingsMenuList from "./settingsMenu/SettingsMenuList";
import ToggleAppModeBtn from "./settingsMenu/ToggleAppModeBtn";
import ToggleDarkModeBtn from "./settingsMenu/ToggleDarkModeBtn";

import TrmrkTextCaretPositioner from "./textMagnifier/TrmrkTextMagnifier";
import TrmrkTextMagnifierModal from "./textMagnifier/TrmrkTextMagnifierModal";

import TrmrkEditableMultilineTextMagnifier from "./textMagnifier/TrmrkEditableMultilineTextMagnifier";
import TrmrkEditableTextLineMagnifier from "./textMagnifier/TrmrkEditableTextLineMagnifier";
import TrmrkReadonlyMultilineTextMagnifier from "./textMagnifier/TrmrkReadonlyMultilineTextMagnifier";
import TrmrkReadonlyTextLineMagnifier from "./textMagnifier/TrmrkReadonlyTextLineMagnifier";
import TrmrkTextMagnifierPopover from "./textMagnifier/TrmrkTextMagnifierPopover";

import TrmrkTreeNode from "./treeNodes/TrmrkTreeNode";
import { TrmrkTreeNodeClickLocation } from "./treeNodes/TrmrkTreeNodeData";
import TrmrkTreeNodeLeaf from "./treeNodes/TrmrkTreeNodeLeaf";
import TrmrkTreeNodesList from "./treeNodes/TrmrkTreeNodesList";

export const components = {
  AppBarsPanel,
  BarsPanel,
  ToggleAppBarBtn,
  ErrorEl,
  ...icons,
  LoadingDotPulse,
  ResizablePanel,
  AppearenceSettingsMenu,
  AppearenceSettingsMenuList,
  OptionsMenu,
  OptionsMenuList,
  SettingsMenu,
  SettingsMenuList,
  ToggleAppModeBtn,
  ToggleDarkModeBtn,
  TrmrkTextCaretPositioner,
  TrmrkTextCaretPositionerModal: TrmrkTextMagnifierModal,
  TrmrkEditableMultilineTextMagnifier,
  TrmrkEditableTextLineMagnifier,
  TrmrkReadonlyMultilineTextMagnifier,
  TrmrkReadonlyTextLineMagnifier,
  TrmrkTextMagnifierPopover,
  TrmrkTreeNode,
  TrmrkTreeNodeClickLocation,
  TrmrkTreeNodeLeaf,
  TrmrkTreeNodesList,
};
