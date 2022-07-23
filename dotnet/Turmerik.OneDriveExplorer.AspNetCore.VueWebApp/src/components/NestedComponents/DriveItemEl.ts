import { ComponentPropsOptions, ComponentObjectPropsOptions } from "vue";

import { DriveItem } from "../../services/Entities/Entities";

export interface DriveItemEl {
  data: DriveItem;
  isChecked: boolean;
  isSelected: boolean;
  iconCssClass: string;
  checkIconCssClass: string;
  fileNameWithoutExtension: string;
  fileNameExtension: string;
}
