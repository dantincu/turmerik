import { Trmrk, NumHashKeyType } from "../common/core/core";
import { TrmrkAxios, TrmrkAxiosApiResult } from "../common/axios/trmrkAxios";
import { WebStorageAxios } from "../common/axios/webStorageAxios";
import { DriveItem, AppSettings } from "./Entities/Entities";
import { WebStorage } from "@/common/core/webStorage";
import { OfficeLikeFileType } from "./Entities/Entities";

export class DriveExplorerService {
  loading: boolean;
  hasData: boolean;
  currentDriveFolderId: string | null;
  currentDriveFolder: DriveItem | null;
  status: string | null;
  statusText: string | null;
  error: string | object | null;

  constructor(public driveExplorerApi: DriveExplorerApi) {
    this.loading = false;
    this.hasData = false;
    this.currentDriveFolderId = null;
    this.currentDriveFolder = null;
    this.status = null;
    this.statusText = null;
    this.error = null;
  }

  async loadDriveFolderAsync(driveFolderId: string | null) {
    this.currentDriveFolderId = driveFolderId;
    this.hasData = false;
    this.loading = true;

    const apiResponse = await this.driveExplorerApi
      .getDriveFolderAsync(driveFolderId ?? "")
      .catch(
        (reason) =>
          new TrmrkAxiosApiResult<DriveItem>({
            exc: reason,
          })
      );

    this.loading = false;

    if (!apiResponse.isSuccess) {
      this.status = apiResponse.getStatusStr() ?? null;
      this.statusText = apiResponse.getStatusText() ?? null;

      if (apiResponse.exc) {
        this.error = JSON.stringify(apiResponse.exc);
      }
    } else {
      this.currentDriveFolder = apiResponse.data;
      this.hasData = true;
    }

    return apiResponse;
  }
}

export const officeFileLikeTypeExtensions: NumHashKeyType<string> = {};

officeFileLikeTypeExtensions[OfficeLikeFileType.docs] = ".docx";
officeFileLikeTypeExtensions[OfficeLikeFileType.sheets] = ".xlsx";
officeFileLikeTypeExtensions[OfficeLikeFileType.slides] = ".pptx";

export const driveItemNameInvalidChars = '\\/:*?"<>|';

export class DriveExplorerApi {
  trmrkAxios: TrmrkAxios;
  webStorage: WebStorage;
  appSettings: AppSettings | null = null;
  getDriveItemMacrosRelUri: string | null = null;
  username = null;

  constructor(public webStorageAxios: WebStorageAxios) {
    this.webStorage = webStorageAxios.webStorage;
    this.trmrkAxios = webStorageAxios.trmrkAxios;
  }

  setAppSettings(appSettings: AppSettings) {
    this.appSettings = appSettings;

    this.getDriveItemMacrosRelUri =
      appSettings.apiExplorerRelUri +
      "/" +
      appSettings.getDriveItemMacrosActionName;
  }

  getDriveFolderCacheKey(driveFolderId: string) {
    let cacheKey: string;

    if (Trmrk.valIsStr(driveFolderId, false, true)) {
      cacheKey = this.webStorage.getCacheKey(
        this.appSettings?.driveFolderCacheKeyName as string,
        driveFolderId,
        this.username
      );
    } else {
      cacheKey = this.webStorage.getCacheKey(
        this.appSettings?.rootDriveFolderCacheKeyName as string,
        this.username
      );
    }

    return cacheKey;
  }

  async getDriveFolderAsync(driveFolderId: string, refreshCache = false) {
    const cacheKey = this.getDriveFolderCacheKey(driveFolderId);
    let relUrl = ("/" + this.appSettings?.apiFolderRelUri) as string;

    if (Trmrk.valIsStr(driveFolderId)) {
      relUrl += "/" + encodeURIComponent(driveFolderId);
    }

    const apiResult = await this.webStorageAxios.get<DriveItem>(
      relUrl,
      cacheKey,
      false,
      null,
      refreshCache
    );

    return apiResult;
  }

  async updateDriveFolderNameAsync(
    driveFolderId: string,
    newFolderName: string
  ) {
    this.validateDriveItemIdAndNewName(driveFolderId, newFolderName);
    const relUrl =
      this.appSettings?.apiFolderRelUri +
      "/" +
      encodeURIComponent(driveFolderId);

    const params = {
      name: newFolderName,
    };

    const apiResult = await this.trmrkAxios.put(relUrl, params);
    return apiResult;
  }

  async addDriveFolderAsync(parentFolderId: string, newFolderName: string) {
    this.validateDriveItemIdAndNewName(parentFolderId, newFolderName);
    const relUrl = this.appSettings?.apiFolderRelUri as string;

    const params = {
      parentFolderId: parentFolderId,
      name: newFolderName,
    };

    const apiResult = await this.trmrkAxios.post(relUrl, params);
    return apiResult;
  }

  async removeDriveFolderAsync(driveFolderId: string) {
    this.validateDriveItemId(driveFolderId);
    const relUrl =
      this.appSettings?.apiFolderRelUri +
      "/" +
      encodeURIComponent(driveFolderId);

    const apiResult = await this.trmrkAxios.delete(relUrl);
    return apiResult;
  }

  async updateDriveFileNameAsync(
    driveFileId: string,
    newFileName: string,
    officeLikeFileType: OfficeLikeFileType
  ) {
    this.validateDriveItemIdAndNewName(
      driveFileId,
      newFileName,
      officeLikeFileType
    );
    const relUrl =
      this.appSettings?.apiFileRelUri + "/" + encodeURIComponent(driveFileId);

    const params = {
      name: newFileName,
      officeLikeFileType: officeLikeFileType,
    };

    const apiResult = await this.trmrkAxios.put(relUrl, params);
    return apiResult;
  }

  async addDriveFileAsync(
    parentFolderId: string,
    newFileName: string,
    officeLikeFileType: OfficeLikeFileType
  ) {
    this.validateDriveItemIdAndNewName(
      parentFolderId,
      newFileName,
      officeLikeFileType
    );

    const relUrl = this.appSettings?.apiFileRelUri as string;

    const params = {
      parentFolderId: parentFolderId,
      name: newFileName,
    };

    const apiResult = await this.trmrkAxios.post(relUrl, params);
    return apiResult;
  }

  async removeDriveFileAsync(driveFileId: string) {
    this.validateDriveItemId(driveFileId);

    const relUrl =
      this.appSettings?.apiFileRelUri + "/" + encodeURIComponent(driveFileId);

    const apiResult = await this.trmrkAxios.delete(relUrl);
    return apiResult;
  }

  async getDriveItemMacrosAsync() {
    const relUri = this.getDriveItemMacrosRelUri as string;
    const cacheKey = this.appSettings?.driveItemMacrosCacheKeyName as string;

    const apiResult = await this.webStorageAxios.get(relUri, cacheKey);

    return apiResult;
  }

  setDriveFolderToCache(driveFolder: DriveItem, parentFolderId: string) {
    const cacheKey = this.getDriveFolderCacheKey(driveFolder.id as string);

    if (Trmrk.valIsStr(parentFolderId, false, true)) {
      driveFolder = {
        ...driveFolder,
        parentFolderId: parentFolderId,
      };
    }

    const driveFolderJson = JSON.stringify(driveFolder);
    sessionStorage.setItem(cacheKey, driveFolderJson);
  }

  removeDriveFolderFromCache(driveFolder: DriveItem) {
    const cacheKey = this.getDriveFolderCacheKey(driveFolder.id as string);
    sessionStorage.removeItem(cacheKey);
  }

  validateDriveItemId(driveItemId: string) {
    this.validateRequiredStringItems([
      {
        key: "driveItemId",
        value: driveItemId,
      },
    ]);
  }

  validateDriveItemIdAndNewName(
    driveItemId: string,
    newItemName: string,
    officeLikeFileType: OfficeLikeFileType | null = null
  ) {
    this.validateRequiredStringItems([
      {
        key: "driveItemId",
        value: driveItemId,
      },
      {
        key: "newItemName",
        value: newItemName,
      },
    ]);

    this.validateDriveItemName(newItemName);

    if (Trmrk.valIsNotNaNNumber(officeLikeFileType)) {
      this.validateOfficeLikeFileName(
        newItemName,
        officeLikeFileType as OfficeLikeFileType
      );
    }
  }

  validateRequiredStringItems(
    argsArr: {
      key: string;
      value: string;
    }[]
  ) {
    for (const arg of argsArr) {
      if (!Trmrk.valIsStr(arg.value, false, true)) {
        throw arg.key + " must be a non-empty string";
      }
    }
  }

  validateDriveItemName(newItemName: string) {
    const charsArr = newItemName
      .split("")
      .filter((c) => driveItemNameInvalidChars.indexOf(c) >= 0);

    if (charsArr.length > 0) {
      const errorMessage =
        'Drive name "' +
        newItemName +
        '" contains the following illegal chars: ' +
        charsArr.join();
      throw errorMessage;
    }
  }

  validateOfficeLikeFileName(
    newItemName: string,
    officeLikeFileType: OfficeLikeFileType
  ) {
    let requiredExtension: string | null;

    switch (officeLikeFileType) {
      case OfficeLikeFileType.docs:
      case OfficeLikeFileType.sheets:
      case OfficeLikeFileType.slides:
        requiredExtension = officeFileLikeTypeExtensions[officeLikeFileType];

        this.validateOfficeLikeFileNameExtension(
          newItemName,
          requiredExtension
        );
        break;
      default:
        throw "Unknown office like file type id: " + officeLikeFileType;
    }
  }

  validateOfficeLikeFileNameExtension(
    newItemName: string,
    requiredExtension: string
  ) {
    if (!newItemName.endsWith(requiredExtension)) {
      throw (
        'Office file name "' +
        newItemName +
        '" should end with extension ' +
        requiredExtension
      );
    }
  }
}
