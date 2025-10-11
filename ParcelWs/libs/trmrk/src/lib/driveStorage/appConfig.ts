import { NullOrUndef } from '../core';

export enum DriveStorageType {
  IndexedDb = 0,
  FileSystemApi = 1,
  RestApi = 2,
  PostMessage = 3,
}

export interface DriveStorageOption {
  key: string;
  displayName: string;
  description?: string | NullOrUndef;
  storageType: DriveStorageType;
  isEnabled?: boolean | NullOrUndef;
  mainApiBaseUri?: string | NullOrUndef;
  itemIdnfIsPath?: boolean | NullOrUndef;
  cacheValidIntervalMillis?: number | NullOrUndef;
}

export interface AppConfig {
  driveStorageOptions: DriveStorageOption[];
}
