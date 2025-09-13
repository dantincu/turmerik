import { NullOrUndef } from '../core';

export enum DriveStorageType {
  IndexedDb = 0,
  FileSystemApi,
  PostMessage,
  RestApi,
}

export interface DriveStorageOption {
  key: string;
  displayName: string;
  storageType: DriveStorageType;
  isEnabled?: boolean | NullOrUndef;
  mainApiBaseUri?: string | NullOrUndef;
  restrictedApiBaseUri?: string | NullOrUndef;
  itemIdnfIsPath?: boolean | NullOrUndef;
  cacheValidIntervalMillis?: number | NullOrUndef;
}

export interface AppConfig {
  driveStorageOptions: DriveStorageOption[];
}
