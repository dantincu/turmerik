import { App } from "vue";
import * as VueRouter from "vue-router";
import { DefineComponent } from "vue";

import { IHash, Trmrk } from "../common/core/core";
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

const getRoute = (
  template: string,
  basePath: string,
  componentName: string
): ITrmrkRoute => ({
  template: template,
  basePath: basePath,
  routeComponent: getComponentWrapper(componentName, "Component"),
  appMenuComponent: getComponentWrapper(componentName, "AppMenuComponent"),
});

export interface ITrmrkRoute {
  template: string;
  basePath: string;
  routeComponent: IComponentWrapper;
  appMenuComponent: IComponentWrapper;
}

export const routePaths = {
  driveExplorer: "/explore-files",
  imagesExplorer: "/explore-images",
  textFile: "/text-file",
  imageFile: "/image-file",
  videoFile: "/video-file",
  audioFile: "/audio-file",
  downloadFile: "/download-file",
  userOptions: "/options",
  home: "/",
};

const driveFileIdSeg = ":driveFileId";
const driveFolderIdSegOpt = ":driveFolderId?";

const getRouteTemplateStr = (
  routePath: string,
  secondSeg: string | null = null
) => {
  let templateStr = routePath;

  if (Trmrk.valIsStr(secondSeg, false, true)) {
    templateStr = [templateStr, secondSeg].join("/");
  }

  return templateStr;
};

export const routeTemplates = {
  driveExplorer: getRouteTemplateStr(
    routePaths.driveExplorer,
    driveFolderIdSegOpt
  ),
  imagesExplorer: getRouteTemplateStr(
    routePaths.imagesExplorer,
    driveFolderIdSegOpt
  ),
  textFile: getRouteTemplateStr(routePaths.textFile, driveFileIdSeg),
  videoFile: getRouteTemplateStr(routePaths.videoFile, driveFileIdSeg),
  imageFile: getRouteTemplateStr(routePaths.imageFile, driveFileIdSeg),
  audioFile: getRouteTemplateStr(routePaths.audioFile, driveFileIdSeg),
  downloadFile: getRouteTemplateStr(routePaths.downloadFile, driveFileIdSeg),
  userOptions: getRouteTemplateStr(routePaths.userOptions),
  home: getRouteTemplateStr(routePaths.home),
};

export const routePathsMap: ITrmrkRoute[] = [
  getRoute(routeTemplates.userOptions, routePaths.userOptions, "UserOptions"),
  getRoute(
    routeTemplates.imagesExplorer,
    routePaths.imagesExplorer,
    "ImagesExplorer"
  ),
  getRoute(routeTemplates.textFile, routePaths.textFile, "TextFile"),
  getRoute(routeTemplates.imageFile, routePaths.imageFile, "ImageFile"),
  getRoute(routeTemplates.videoFile, routePaths.videoFile, "VideoFile"),
  getRoute(routeTemplates.audioFile, routePaths.audioFile, "AudioFile"),
  getRoute(
    routeTemplates.downloadFile,
    routePaths.downloadFile,
    "DownloadFile"
  ),
  getRoute(
    routeTemplates.driveExplorer,
    routePaths.driveExplorer,
    "DriveExplorer"
  ),
  getRoute(routeTemplates.home, routePaths.home, "Home"),
];

export const routeComponents = routePathsMap.map(
  (route) => route.routeComponent
);

export const appMenuComponents = routePathsMap.map(
  (route) => route.appMenuComponent
);

export const mainComponents = [...routeComponents, ...appMenuComponents];

export const routes = routePathsMap.map((route) => ({
  path: route.template,
  component: route.routeComponent,
}));

export const registerRoutes = (app: App) => {
  const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
  });

  app.use(router);
};
