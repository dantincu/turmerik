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
  TrmrkTreeNode,
  TrmrkTreeNodeClickLocation,
  TrmrkTreeNodeLeaf,
  TrmrkTreeNodesList,
};
