import { Trmrk } from "../common/core/core";

import { TrmrkAxiosApiResult } from "../common/axios/trmrkAxios";
import { WebStorageAxios } from "../common/axios/webStorageAxios";
import { AppSettings } from "./Entities/Entities";

export class AppSettingsService {
  public readonly apiBaseUrl: string = process.env.VUE_APP_API_BASE_URL;
  private appSettings: TrmrkAxiosApiResult<AppSettings> | null = null;

  constructor(public webStorageAxios: WebStorageAxios) {}

  public async getAppSettingsAsync(): Promise<
    TrmrkAxiosApiResult<AppSettings>
  > {
    let appSettings: TrmrkAxiosApiResult<AppSettings> = this
      .appSettings as TrmrkAxiosApiResult<AppSettings>;

    if (!Trmrk.valIsNotNullObj(appSettings)) {
      appSettings = await this.getAppSettingsCoreAsync();
      this.appSettings = appSettings;
    }

    return appSettings;
  }

  public getAppSettings() {
    const appSettings = this.appSettings;

    if (!Trmrk.valIsNotNullObj(appSettings)) {
      throw "App settings should have been fetched by now";
    }

    return appSettings;
  }

  private async getAppSettingsCoreAsync() {
    const url = [
      /* this.apiBaseUrl, */ "/api",
      "explorer",
      "getAppSettings",
    ].join("/");

    const cacheKey = this.webStorageAxios.webStorage.getCacheKey("appSettings");

    const apiResponse = await this.webStorageAxios.get<AppSettings>(
      url,
      cacheKey
    );

    if (!apiResponse.isSuccess || !Trmrk.valIsNotNullObj(apiResponse.data)) {
      throw "Could not get app settings";
    }

    return apiResponse;
  }
}
