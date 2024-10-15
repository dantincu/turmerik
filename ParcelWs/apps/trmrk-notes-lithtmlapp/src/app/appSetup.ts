import {
  defaultAppTitlePropFactory,
  homePageUrlPropFactory,
} from "../trmrk-lithtml/components/AppLayout/core";

export const runAppSetup = () => {
  homePageUrlPropFactory.observable.value = "/app";
  defaultAppTitlePropFactory.observable.value = "Turmerik Notes";
  console.log("Setup complete", new Date());
};
