import AppBarsPanel from "./barsPanel/AppBarsPanel";
import BarsPanel from "./barsPanel/BarsPanel";
import ToggleAppBarBtn from "./barsPanel/ToggleAppBarBtn";

import ErrorEl from "./error/ErrorEl";

import * as icons from "./icons";

import LoadingDotPulse from "./loading/LoadingDotPulse";

import AppearenceSettingsMenu from "./settingsMenu/AppearenceSettingsMenu";
import AppearenceSettingsMenuList from "./settingsMenu/AppearenceSettingsMenuList";
import TextCaretPositionerSettingsMenu from "./settingsMenu/TextCaretPositionerSettingsMenu";
import TextCaretPositionerSettingsMenuList from "./settingsMenu/TextCaretPositionerSettingsMenuList";
import OptionsMenu from "./settingsMenu/OptionsMenu";
import OptionsMenuList from "./settingsMenu/OptionsMenuList";
import SettingsMenu from "./settingsMenu/SettingsMenu";
import SettingsMenuList from "./settingsMenu/SettingsMenuList";
import ToggleAppModeBtn from "./settingsMenu/ToggleAppModeBtn";
import ToggleDarkModeBtn from "./settingsMenu/ToggleDarkModeBtn";
import TrmrkBackDrop from "./backDrop/TrmrkBackDrop";

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
  AppearenceSettingsMenu,
  AppearenceSettingsMenuList,
  TextCaretPositionerSettingsMenu,
  TextCaretPositionerSettingsMenuList,
  OptionsMenu,
  OptionsMenuList,
  SettingsMenu,
  SettingsMenuList,
  ToggleAppModeBtn,
  ToggleDarkModeBtn,
  TrmrkBackDrop,
  TrmrkTreeNode,
  TrmrkTreeNodeClickLocation,
  TrmrkTreeNodeLeaf,
  TrmrkTreeNodesList,
};
