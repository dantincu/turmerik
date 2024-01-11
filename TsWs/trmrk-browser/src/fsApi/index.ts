import * as core from "./core";
import * as file from "./file";
import * as hcy from "./hcy";
import * as folder from "./folder";

export const fsApi = {
  ...core,
  ...file,
  ...hcy,
  ...folder,
};
