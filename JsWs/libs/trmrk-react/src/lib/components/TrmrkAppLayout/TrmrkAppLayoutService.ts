import { atom } from "jotai";

export const showAppBar = atom(true);
export const showAppBarOnly = atom(false);
export const appBarComponentKey = atom<string | null>(null);

export const showTopToolbar = atom(false);
export const topToolbarComponentKey = atom<string | null>(null);

export const showBottomToolbar = atom(false);
export const bottomToolbarComponentKey = atom<string | null>(null);

export const showLeftPanel = atom(false);
export const leftPanelComponentKey = atom<string | null>(null);

export const showRightPanel = atom(false);
export const rightPanelComponentKey = atom<string | null>(null);

export interface TrmrkAppLayoutComponentsMap {
  map: { [key: string]: React.ReactNode };
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
