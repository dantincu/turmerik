import { App } from "vue";
import * as VueRouter from "vue-router";
import { DefineComponent } from "vue";

import { IHash } from "../common/core/core";
import { IComponentWrapper } from "./MapComponents";
import { componentsMap } from "./MapComponentsCore";

const getComponentWrapper = (
  componentName: string,
  nameSuffix: string
): IComponentWrapper => {
  componentName += nameSuffix;

  const retObj = {
    componentName: componentName,
    component: componentsMap[componentName],
  };

  return retObj;
};

const getRoute = (path: string, componentName: string): ITrmrkRoute => ({
  path: path,
  routeComponent: getComponentWrapper(componentName, "Component"),
  appMenuComponent: getComponentWrapper(componentName, "AppMenuComponent"),
});

export interface ITrmrkRoute {
  path: string;
  routeComponent: IComponentWrapper;
  appMenuComponent: IComponentWrapper;
}

export const routePaths = {
  userOptions: "/options",
  imagesExplorer: "/images",
  textFile: "/text-file",
  imageFile: "/image-file",
  videoFile: "/video-file",
  audioFile: "/audio-file",
  driveExplorer: "/",
};

export const routePathsMap: ITrmrkRoute[] = [
  getRoute(routePaths.userOptions, "UserOptions"),
  getRoute(routePaths.imagesExplorer, "ImagesExplorer"),
  getRoute(routePaths.textFile, "TextFile"),
  getRoute(routePaths.imageFile, "ImageFile"),
  getRoute(routePaths.videoFile, "VideoFile"),
  getRoute(routePaths.audioFile, "AudioFile"),
  getRoute(routePaths.driveExplorer, "DriveExplorer"),
];

export const routeComponents = routePathsMap.map(
  (route) => route.routeComponent
);

export const appMenuComponents = routePathsMap.map(
  (route) => route.appMenuComponent
);

export const mainComponents = [...routeComponents, ...appMenuComponents];

export const routes = routePathsMap.map((route) => ({
  path: route.path,
  component: route.routeComponent,
}));

export const registerRoutes = (app: App) => {
  const router = VueRouter.createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
  });

  app.use(router);
};
