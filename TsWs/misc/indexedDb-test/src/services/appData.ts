export interface AppRouteInfo {
  pathname: string;
  appTitle: string;
  htmlDocTitle: string;
}

export interface AppData {
  currentRoute: AppRouteInfo;
}
