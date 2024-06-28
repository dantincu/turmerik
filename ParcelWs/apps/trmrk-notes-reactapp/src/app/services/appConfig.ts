import { loadAppConfig } from "../../trmrk/notes-app-config";

const appConfigData = await loadAppConfig();

export const appConfig = Object.freeze({
  data: appConfigData,
});

export const throwIfNoAppConfig = () => {
  if (!appConfig.data) {
    throw new Error("App Config must be loaded");
  }
};
