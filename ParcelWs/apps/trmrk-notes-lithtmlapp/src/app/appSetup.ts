import { homePageUrlPropFactory } from "../trmrk-lithtml/components/AppLayout/core";

export const runAppSetup = () => {
  homePageUrlPropFactory.observable.value = "/app";
  console.log("Setup complete", new Date());
};
