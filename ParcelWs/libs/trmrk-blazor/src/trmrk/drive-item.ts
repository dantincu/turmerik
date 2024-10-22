import {
  dotNetDateTimeToJsMillis,
  moveUtcDateToLocalTime,
  ticksToMillis,
  dateToDisplayStr,
} from "./date";

import {
  DriveItem as DriveItemType,
  DriveItemCore,
} from "./DotNetTypes/Turmerik.Core.DriveExplorer.DriveItemCore";

export interface DriveItem extends DriveItemType<DriveItem> {}

export const dotNetUtcTicksToJsDate = (dotNetUtcTicks: number) => {
  const dotNetUtcMillis = ticksToMillis(dotNetUtcTicks);
  const jsMillis = dotNetDateTimeToJsMillis(dotNetUtcMillis);

  const localDate = new Date(jsMillis);
  moveUtcDateToLocalTime(localDate);

  return localDate;
};

export const fillDriveItemTimeStamps = (driveItem: DriveItemCore) => {
  if (driveItem.CreationTimeUtcTicks) {
    driveItem.CreationTime ??= dotNetUtcTicksToJsDate(
      driveItem.CreationTimeUtcTicks
    );

    driveItem.CreationTimeStr ??= dateToDisplayStr(driveItem.CreationTime);
  }

  if (driveItem.LastWriteTimeUtcTicks) {
    driveItem.LastWriteTime ??= dotNetUtcTicksToJsDate(
      driveItem.LastWriteTimeUtcTicks
    );

    driveItem.LastWriteTimeStr ??= dateToDisplayStr(driveItem.LastWriteTime);
  }

  if (driveItem.LastAccessTimeUtcTicks) {
    driveItem.LastAccessTime ??= dotNetUtcTicksToJsDate(
      driveItem.LastAccessTimeUtcTicks
    );

    driveItem.LastAccessTimeStr ??= dateToDisplayStr(driveItem.LastAccessTime);
  }
};

export const fillDriveFolderTimeStamps = <
  TDriveItem extends DriveItemType<TDriveItem>
>(
  driveFolder: DriveItemType<TDriveItem>,
  depth?: number
) => {
  fillDriveItemTimeStamps(driveFolder);
  depth ??= -1;

  if (depth > 0) {
    if (driveFolder.FolderFiles) {
      for (let file of driveFolder.FolderFiles) {
        fillDriveItemTimeStamps(file);
      }
    }

    if (driveFolder.SubFolders) {
      depth--;

      for (let folder of driveFolder.SubFolders) {
        fillDriveFolderTimeStamps(folder, depth);
      }
    }
  }
};
