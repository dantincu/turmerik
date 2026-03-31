import DarkMode from "@iconify-icons/material-symbols/dark-mode";
import LightMode from "@iconify-icons/material-symbols/light-mode";

import { registerIconifyIcons } from "@/src/trmrk-react/services/iconify/registerIcons";
import { registerIconifyIconsCore } from "@/src/trmrk-react/services/iconify/iconsRegistration";

export const registerAppIconifyIcons = () => {
  registerIconifyIcons();

  registerIconifyIconsCore("mdi", {});

  registerIconifyIconsCore("material-symbols", {
    "dark-mode": DarkMode,
    "light-mode": LightMode,
  });
};
