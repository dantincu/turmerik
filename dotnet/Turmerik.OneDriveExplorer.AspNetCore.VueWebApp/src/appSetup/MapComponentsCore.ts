import { App } from "vue";

import { Trmrk, IHash } from "../common/core/core";
import { TrmrkClientBrowser } from "../common/browser/browser";

import {
  TrmrkBootStrap,
  TrmrkBootstrapApp,
} from "../common/browser/bootstrap/bootstrap";

export const trmrkClientBrowser = new TrmrkClientBrowser();

export const trmrkBootStrap = new TrmrkBootStrap(trmrkClientBrowser);
export const trmrkBootStrapApp = new TrmrkBootstrapApp(
  trmrkBootStrap,
  trmrkClientBrowser
);

export const componentsMap: IHash<object> = {};
export const servicesMap: IHash<object | Function> = {};

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

export const mapComponent = (
  componentName: string,
  componentService: object | Function,
  routeComponent: object,
  appMenuComponent: object
) => {
  const serviceName = Trmrk.firstLetterToLowerCase(componentName);
  servicesMap[serviceName + "Service"] = componentService;

  componentsMap[componentName + "Component"] = routeComponent;
  componentsMap[componentName + "AppMenuComponent"] = appMenuComponent;
};
