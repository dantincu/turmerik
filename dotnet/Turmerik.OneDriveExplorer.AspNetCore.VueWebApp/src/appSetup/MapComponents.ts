import { App } from "vue";

import { servicesMap } from "./MapComponentsCore";
import { mapDriveExplorerComponent } from "./MapComponents/MapDriveExplorerComponent";
import { mapUserOptionsComponent } from "./MapComponents/MapUserOptionsComponent";
import { mapImagesExplorerComponent } from "./MapComponents/MapImagesExplorerComponent";
import { mapImageFileComponent } from "./MapComponents/MapImageFileComponent";
import { mapVideoFileComponent } from "./MapComponents/MapVideoFileComponent";
import { mapAudioFileComponent } from "./MapComponents/MapAudioFileComponent";
import { mapTextFileComponent } from "./MapComponents/MapTextFileComponent";

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

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

export const registerComponents = (
  app: App,
  allComponents: IComponentWrapper[]
) => {
  for (const component of allComponents) {
    app.component(component.componentName, component.component);
  }
};

export const registerServices = (app: App) => {
  for (const key of Object.keys(servicesMap)) {
    app.provide(key, servicesMap[key]);
  }
};
