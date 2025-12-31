import { getTrmrk } from '../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core';

export interface DarkModeServiceInitArgs {
  onDarkModeStateChanged?: (isDarkMode: boolean) => void;
}

export const prefersDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const isDarkMode = (localStorageIsDarkModeKey: string) => {
  const localStorageIsDarkMode = localStorage.getItem(localStorageIsDarkModeKey);

  let isDarkMode: boolean;

  if (localStorageIsDarkMode) {
    if ('true' === localStorageIsDarkMode) {
      isDarkMode = true;
    } else if ('false' === localStorageIsDarkMode) {
      isDarkMode = false;
    } else {
      isDarkMode = prefersDarkMode();
    }
  } else {
    isDarkMode = prefersDarkMode();
  }

  return isDarkMode;
};

export class DarkModeService implements Disposable {
  onDarkModeStateChanged!: (isDarkMode: boolean) => void;
  dbObjNamePrefix!: string;
  appThemeIsDarkModeLocalStorageKey!: string;

  private _disposeCalled = false;

  constructor() {
    this.storageEvent = this.storageEvent.bind(this);
  }

  init(args?: DarkModeServiceInitArgs | null | undefined) {
    args ??= {};
    this.onDarkModeStateChanged = args.onDarkModeStateChanged ??= () => {};
    this.dbObjNamePrefix = getTrmrk().dbObjNamePrefix;
    this.appThemeIsDarkModeLocalStorageKey = `${this.dbObjNamePrefix}[appThemeIsDarkMode]`;
    window.addEventListener('storage', this.storageEvent);
    this.detectDarkMode();
  }

  storageEvent(event: StorageEvent) {
    if ((event.key ?? null) === null || event.key === this.appThemeIsDarkModeLocalStorageKey) {
      let isDarkModeValue = false;

      if (
        (event.key ?? null) === null ||
        (event.key === this.appThemeIsDarkModeLocalStorageKey && (event.newValue ?? null) === null)
      ) {
        isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
      } else {
        isDarkModeValue = event.newValue === 'true';
      }

      this.darkModeLocalStorageValueChanged(isDarkModeValue);
    }
  }

  darkModeLocalStorageValueChanged(isDarkModeValue: boolean) {
    this.darkModeStateChange(isDarkModeValue);
  }

  darkModeStateChange(isDarkModeValue: boolean) {
    document.documentElement.setAttribute('data-theme', isDarkModeValue ? 'dark' : 'light');
    this.onDarkModeStateChanged(isDarkModeValue);
  }

  detectDarkMode() {
    const isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
    this.darkModeStateChange(isDarkModeValue);
  }

  dispose() {
    if (!this._disposeCalled) {
      this._disposeCalled = true;
      this.onDarkModeStateChanged = null!;
      window.removeEventListener('storage', this.storageEvent);
    }
  }

  [Symbol.dispose]() {
    this.dispose();
  }
}
