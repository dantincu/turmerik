import { IRefValue } from "../../common/core/core";
import { DriveItem } from "../../services/Entities/Entities";

export interface DriveItemEl {
  data: DriveItem;
  parentFolderId: string;
  id: string;
  url: string;
  isChecked: boolean;
  isSelected: boolean;
  iconCssClass: string;
  checkIconCssClass: string;
  fileNameWithoutExtension: string;
  fileNameExtension: string;
  isEditing: boolean;
  rowCssClass: string;
}
