import { App } from "vue";
import { Axios } from "axios";

import {
  servicesMap,
  trmrkClientBrowser,
  trmrkBootStrap,
  trmrkBootStrapApp,
} from "./MapComponentsCore";

import { mapHomeComponent } from "./MapComponents/MapHomeComponent";
import { mapDriveExplorerComponent } from "./MapComponents/MapDriveExplorerComponent";
import { mapUserOptionsComponent } from "./MapComponents/MapUserOptionsComponent";
import { mapImagesExplorerComponent } from "./MapComponents/MapImagesExplorerComponent";
import { mapImageFileComponent } from "./MapComponents/MapImageFileComponent";
import { mapVideoFileComponent } from "./MapComponents/MapVideoFileComponent";
import { mapAudioFileComponent } from "./MapComponents/MapAudioFileComponent";
import { mapTextFileComponent } from "./MapComponents/MapTextFileComponent";

import DriveItemsGridComponent from "../components/NestedComponents/DriveItemsGridComponent.vue";
import { WebStorage } from "../common/core/webStorage";
import { TrmrkAxios } from "../common/axios/trmrkAxios";
import { WebStorageAxios } from "../common/axios/webStorageAxios";
import {
  DriveExplorerApi,
  DriveExplorerService,
} from "../services/DriveExplorerService";

import { AppSettingsService } from "../services/AppSettingsService";

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

const axiosFactory = () => new Axios();
const trmrkAxiosFactory = (axios: Axios) => new TrmrkAxios(axios);

const webStorage = new WebStorage();

const webStorageAxiosFactory = (
  webStorage: WebStorage,
  trmrkAxios: TrmrkAxios
) => new WebStorageAxios(webStorage, trmrkAxios);

const appSettingsService = new AppSettingsService(
  webStorageAxiosFactory(webStorage, trmrkAxiosFactory(axiosFactory()))
);

const driveExplorerApiFactory = (webStorageAxios: WebStorageAxios) =>
  new DriveExplorerApi(webStorageAxios);

const driveExplorerService = new DriveExplorerService(
  driveExplorerApiFactory(
    webStorageAxiosFactory(webStorage, trmrkAxiosFactory(axiosFactory()))
  )
);

const fillComponentsMap = () => {
  mapHomeComponent();
  mapDriveExplorerComponent(driveExplorerService);
  mapUserOptionsComponent();
  mapImagesExplorerComponent();
  mapImageFileComponent();
  mapVideoFileComponent();
  mapAudioFileComponent();
  mapTextFileComponent();
};

fillComponentsMap();

export const registerServices = (app: App) => {
  app.provide("trmrkClientBrowser", trmrkClientBrowser);
  app.provide("trmrkBootStrap", trmrkBootStrap);
  app.provide("trmrkBootStrapApp", trmrkBootStrapApp);
  app.provide("axios", axiosFactory);
  app.provide("trmrkAxios", trmrkAxiosFactory);
  app.provide("webStorage", webStorage);
  app.provide("appSettingsService", appSettingsService);
  app.provide("webStorageAxios", webStorageAxiosFactory);
  app.provide("driveExplorerApi", driveExplorerApiFactory);
};

export const registerComponentServices = (app: App) => {
  for (const key of Object.keys(servicesMap)) {
    app.provide(key, servicesMap[key]);
  }
};

export const registerMainComponents = (
  app: App,
  mainComponents: IComponentWrapper[]
) => {
  for (const component of mainComponents) {
    app.component(component.componentName, component.component);
  }
};

export const registerNestedComponents = (app: App) => {
  app.component("DriveItemsGridComponent", DriveItemsGridComponent);
};

export const registerDirectives = (app: App) => {
  // createLongClickDirective(app);
};
