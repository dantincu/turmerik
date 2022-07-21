import { App } from "vue";

import { IHash } from "./common/core/core";
import { TrmrkBootstrapApp } from "./common/browser/bootstrap/bootstrap";

import { DriveExplorerService } from "./services/DriveExplorerService";
import { UserOptionsService } from "./services/UserOptionsService";
import { ImagesExplorerService } from "./services/ImagesExplorerService";
import { TextFileService } from "./services/TextFileService";
import { ImageFileService } from "./services/ImageFileService";
import { VideoFileService } from "./services/VideoFileService";
import { AudioFileService } from "./services/AudioFileService";

import DriveExplorerComponent from "./components/DriveExplorerComponent.vue";
import DriveExplorerAppMenuComponent from "./components/DriveExplorerAppMenuComponent.vue";
import UserOptionsComponent from "./components/UserOptionsComponent.vue";
import UserOptionsAppMenuComponent from "./components/UserOptionsAppMenuComponent.vue";
import ImagesExplorerComponent from "./components/ImagesExplorerComponent.vue";
import ImagesExplorerAppMenuComponent from "./components/ImagesExplorerAppMenuComponent.vue";
import TextFileComponent from "./components/TextFileComponent.vue";
import TextFileAppMenuComponent from "./components/TextFileAppMenuComponent.vue";
import ImageFileComponent from "./components/ImageFileComponent.vue";
import ImageFileAppMenuComponent from "./components/ImageFileAppMenuComponent.vue";
import VideoFileComponent from "./components/VideoFileComponent.vue";
import VideoFileAppMenuComponent from "./components/VideoFileAppMenuComponent.vue";
import AudioFileComponent from "./components/AudioFileComponent.vue";
import AudioFileAppMenuComponent from "./components/AudioFileAppMenuComponent.vue";

export const trmrkBootstrapApp = new TrmrkBootstrapApp();
export const componentsMap: IHash<object> = {};
export const servicesMap: IHash<object> = {};

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

const addComponentToMap = (
  componentName: string,
  componentService: object,
  routeComponent: object,
  appMenuComponent: object
) => {
  const serviceName =
    trmrkBootstrapApp.browser.core.firstLetterToLowerCase(componentName);

  servicesMap[serviceName + "Service"] = componentService;

  componentsMap[componentName + "Component"] = routeComponent;
  componentsMap[componentName + "AppMenuComponent"] = appMenuComponent;
};

const fillComponentsMap = () => {
  addComponentToMap(
    "DriveExplorer",
    new DriveExplorerService(),
    DriveExplorerComponent,
    DriveExplorerAppMenuComponent
  );

  addComponentToMap(
    "UserOptions",
    new UserOptionsService(),
    UserOptionsComponent,
    UserOptionsAppMenuComponent
  );

  addComponentToMap(
    "ImagesExplorer",
    new ImagesExplorerService(),
    ImagesExplorerComponent,
    ImagesExplorerAppMenuComponent
  );

  addComponentToMap(
    "TextFile",
    new TextFileService(),
    TextFileComponent,
    TextFileAppMenuComponent
  );

  addComponentToMap(
    "ImageFile",
    new ImageFileService(),
    ImageFileComponent,
    ImageFileAppMenuComponent
  );

  addComponentToMap(
    "VideoFile",
    new VideoFileService(),
    VideoFileComponent,
    VideoFileAppMenuComponent
  );

  addComponentToMap(
    "AudioFile",
    new AudioFileService(),
    AudioFileComponent,
    AudioFileAppMenuComponent
  );
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
