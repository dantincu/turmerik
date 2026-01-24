import home from "@iconify-icons/mdi/home";
import close from "@iconify-icons/mdi/close";
import chevronDoubleDown from "@iconify-icons/mdi/chevron-double-down";
import chevronDoubleUp from "@iconify-icons/mdi/chevron-double-up";

import { registerIconifyIconsCore } from "./iconsRegistration";

export const registerIconifyIcons = () => {
  registerIconifyIconsCore("mdi", {
    home,
    close,
    ["chevron-double-down"]: chevronDoubleDown,
    ["chevron-double-up"]: chevronDoubleUp,
  });
};
