import { VaadinRouterGoEvent } from "@vaadin/router";

import { ObservableValueSingletonControllerFactory } from "./ObservableValueController";

import { ObservableValue } from "../../trmrk/observable-value";

export class VaadinRouteGoEventControllerFactory extends ObservableValueSingletonControllerFactory<VaadinRouterGoEvent | null> {
  constructor(
    observableValue: ObservableValue<VaadinRouterGoEvent | null> | null = null,
    initialValue: VaadinRouterGoEvent | null = null
  ) {
    super(
      (observableValue ??= new ObservableValue<VaadinRouterGoEvent | null>(
        initialValue
      )),
      initialValue
    );

    this.locationChanged = this.locationChanged.bind(this);
  }

  subscribe() {
    window.addEventListener("vaadin-router-go", this.locationChanged);
  }

  unsubscribe() {
    window.removeEventListener("vaadin-router-go", this.locationChanged);
  }

  locationChanged(e: VaadinRouterGoEvent) {
    this.observable.value = e;
  }
}

export const createVaadinRouterGoEventInstn = () => {
  const location = window.location;

  const retObj: VaadinRouterGoEvent = new CustomEvent("vaadin-router-go", {
    detail: {
      hash: location.hash,
      pathname: location.pathname,
      search: location.search,
    },
    bubbles: true,
    composed: true,
  });

  return retObj;
};

export const vaadinRouteGoEventControllerFactory =
  new VaadinRouteGoEventControllerFactory(
    null,
    createVaadinRouterGoEventInstn()
  );
