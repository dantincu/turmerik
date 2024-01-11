import * as core from "./core";
import * as indexedDB from "./indexedDB";
import * as fsApi from "./fsApi";

export default {
  ...core,
  ...indexedDB,
  ...fsApi,
};
