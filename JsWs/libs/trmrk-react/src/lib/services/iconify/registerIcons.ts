import home from "@iconify-icons/mdi/home";
import close from "@iconify-icons/mdi/close";

import { registerIconifyIconsCore } from "./iconsRegistration";

export const registerIconifyIcons = () => {
  registerIconifyIconsCore("mdi", {
    home,
    close,
  });
};
