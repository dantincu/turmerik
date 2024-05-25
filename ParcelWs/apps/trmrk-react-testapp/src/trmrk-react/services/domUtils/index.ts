// import * as core from "./core";
import * as reactSyntheticEvents from "./reactSyntheticEvents";
import * as touchAndMouseEvents from "./touchAndMouseEvents";

export const domUtils = {
  // ...core,
  ...reactSyntheticEvents,
  ...touchAndMouseEvents,
};
