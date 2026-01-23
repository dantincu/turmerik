import { addIcon, IconifyIcon } from "@iconify/react";

export const registerIconifyIconsCore = (
  pfx: string,
  map: { [iconName: string]: IconifyIcon },
) => {
  for (let iconName of Object.keys(map)) {
    addIcon(`${pfx}:${iconName}`, map[iconName]);
  }
};
