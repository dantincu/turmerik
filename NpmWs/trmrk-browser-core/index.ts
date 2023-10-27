import * as core from "./src/core";

import { indexedDB } from "./src/indexedDB";

export const browser = {
  ...core,
  indexedDB,
};
