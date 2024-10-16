import { ObservableValueSingletonControllerFactory } from "../../trmrk-lithtml/controlers/ObservableValueController";

export enum AppPage {
  Home = 0,
  FolderEntriesList,
}

export const appPagePropFactory =
  new ObservableValueSingletonControllerFactory<AppPage | null>(null, null);
