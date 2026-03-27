import dice from "@iconify-icons/mdi/dice";

import { registerIconifyIcons } from "@/src/trmrk-react/services/iconify/registerIcons";
import { registerIconifyIconsCore } from "@/src/trmrk-react/services/iconify/iconsRegistration";

export const registerAppIconifyIcons = () => {
  registerIconifyIcons();

  registerIconifyIconsCore("mdi", {
    dice,
  });
};
