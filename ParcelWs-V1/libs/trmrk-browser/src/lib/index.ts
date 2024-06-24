import * as core from "./core";
import * as indexedDB from "./indexedDB";
import * as fsApi from "./fsApi";
import * as domUtils from "./domUtils";
import { textCaretPositioner } from "./textCaretPositioner";

export default {
  ...core,
  ...indexedDB,
  ...fsApi,
  domUtils,
  textCaretPositioner,
};
