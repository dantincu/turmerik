import * as indexedDbInspector from "./indexedDbInspector";
import DevTools from "./DevTools";

export const devTools = {
  DevTools,
  ...indexedDbInspector,
};
