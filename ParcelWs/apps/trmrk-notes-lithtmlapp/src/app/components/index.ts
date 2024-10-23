import { AppElement } from "./AppElement";
import { AppPages } from "./Pages";
import { AppLayout } from "./Layout";

export const Components = {
  AppElement,
  ...AppPages,
  ...AppLayout,
};
