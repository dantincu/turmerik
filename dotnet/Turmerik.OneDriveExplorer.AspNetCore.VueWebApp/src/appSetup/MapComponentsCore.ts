import { App } from "vue";

import { IHash } from "../common/core/core";
import { TrmrkBootstrapApp } from "../common/browser/bootstrap/bootstrap";

export const trmrkBootstrapApp = new TrmrkBootstrapApp();
export const componentsMap: IHash<object> = {};
export const servicesMap: IHash<object> = {};

export interface IComponentWrapper {
  componentName: string;
  component: object;
}

export const mapComponent = (
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
