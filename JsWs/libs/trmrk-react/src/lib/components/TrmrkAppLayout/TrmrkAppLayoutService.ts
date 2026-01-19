import { atom } from "jotai";

export const appLayoutAtoms = {
  showAppBar: atom(false),
  showAppBarOnly: atom(false),
  appBarComponentKey: atom<string | null>(null),
  showTopToolbar: atom(false),
  topToolbarComponentKey: atom<string | null>(null),
  showBottomToolbar: atom(false),
  bottomToolbarComponentKey: atom<string | null>(null),
  showLeftPanel: atom(false),
  leftPanelComponentKey: atom<string | null>(null),
  showRightPanel: atom(false),
  rightPanelComponentKey: atom<string | null>(null),
};

export interface TrmrkAppLayoutComponentsMap {
  map: { [key: string]: () => React.ReactNode };
}

export const appBarComponents: TrmrkAppLayoutComponentsMap = {
  map: {},
};

export const topToolbarComponents: TrmrkAppLayoutComponentsMap = {
  map: {},
};

export const bottomToolbarComponents: TrmrkAppLayoutComponentsMap = {
  map: {},
};

export const leftPanelComponents: TrmrkAppLayoutComponentsMap = {
  map: {},
};

export const rightPanelComponents: TrmrkAppLayoutComponentsMap = {
  map: {},
};
