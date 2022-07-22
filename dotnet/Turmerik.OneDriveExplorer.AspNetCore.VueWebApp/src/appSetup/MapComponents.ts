import { App } from "vue";
import { Axios } from "axios";

import { Trmrk } from "../common/core/core";

import {
  servicesMap,
  trmrkClientBrowser,
  trmrkBootStrap,
  trmrkBootStrapApp,
} from "./MapComponentsCore";

import { mapDriveExplorerComponent } from "./MapComponents/MapDriveExplorerComponent";
import { mapUserOptionsComponent } from "./MapComponents/MapUserOptionsComponent";
import { mapImagesExplorerComponent } from "./MapComponents/MapImagesExplorerComponent";
import { mapImageFileComponent } from "./MapComponents/MapImageFileComponent";
import { mapVideoFileComponent } from "./MapComponents/MapVideoFileComponent";
import { mapAudioFileComponent } from "./MapComponents/MapAudioFileComponent";
import { mapTextFileComponent } from "./MapComponents/MapTextFileComponent";

import DriveItemsGridComponent from "../components/NestedComponents/DriveItemsGridComponent.vue";

import { TrmrkAxios } from "../common/axios/trmrkAxios";

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

const axiosFactory = () => new Axios();

const trmrkAxiosFactory = () => new TrmrkAxios(axiosFactory());

const fillComponentsMap = () => {
  mapDriveExplorerComponent();
  mapUserOptionsComponent();
  mapImagesExplorerComponent();
  mapImageFileComponent();
  mapVideoFileComponent();
  mapAudioFileComponent();
  mapTextFileComponent();
};

fillComponentsMap();

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

export const registerServices = (app: App) => {
  app.provide("trmrkClientBrowser", trmrkClientBrowser);
  app.provide("trmrkBootStrap", trmrkBootStrap);
  app.provide("trmrkBootStrapApp", trmrkBootStrapApp);
  app.provide("axios", axiosFactory);
  app.provide("trmrkAxios", trmrkAxiosFactory);
};

export const registerComponentServices = (app: App) => {
  for (const key of Object.keys(servicesMap)) {
    app.provide(key, servicesMap[key]);
  }
};
